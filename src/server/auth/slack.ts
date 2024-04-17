import * as url from 'url';
import type { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import * as Slack from '@slack/web-api';
import * as jwt from 'jsonwebtoken';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import {
  COOKIE_OPTIONS,
  EVERYONE_ORG_ID,
  EVERYONE_ORG_NAME,
  LOGIN_EXPIRES_IN,
  LOGIN_SIGNING_SECRET,
  LOGIN_TOKEN_COOKIE_NAME,
} from 'src/server/consts';
import type { AuthSystem, LoginTokenData } from 'src/server/auth';
import { getCookie } from 'src/server/util';

const slackClient = new Slack.WebClient();

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
const SLACK_TEAM = process.env.SLACK_TEAM!;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;

const NONCE_COOKIE_NAME = 'slack_login_nonce';

export function makeSlackAuth(): AuthSystem {
  if (!SLACK_CLIENT_ID || !SLACK_TEAM || !SLACK_CLIENT_SECRET) {
    throw new Error('Missing keys from .env, is it set up properly?');
  }
  return {
    getAuthRedirect: function (req: Request, res: Response) {
      const nonce = nanoid(10);
      res.cookie(NONCE_COOKIE_NAME, nonce, COOKIE_OPTIONS);
      return url.format({
        protocol: 'https',
        host: 'slack.com',
        pathname: '/openid/connect/authorize',
        query: {
          response_type: 'code',
          scope: ['openid', 'profile', 'email'].join(','),
          client_id: SLACK_CLIENT_ID,
          team: SLACK_TEAM,
          nonce,
          redirect_uri: makeRedirectUri(req),
        },
      });
    },
  };
}

export async function handleGetSlackLogin(req: Request, res: Response) {
  const code = req.query.code;
  const state = req.query.state;

  if (!(typeof code === 'string' && typeof state === 'string')) {
    res.sendStatus(400);
    return;
  }

  const slackResponse = await slackClient.openid.connect.token({
    code,
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET,
    redirect_uri: makeRedirectUri(req),
  });

  if (!slackResponse.ok || !slackResponse.id_token) {
    console.error('Invalid Slack response', slackResponse);
    res.sendStatus(500);
    return;
  }

  const slackUserInfo = jwt.decode(slackResponse.id_token) as {
    [key: string]: string;
  };
  const {
    'https://slack.com/user_id': user_id,
    name,
    email,
    picture,
    nonce,
  } = slackUserInfo;

  const cookieNonce = getCookie(req, NONCE_COOKIE_NAME);
  if (cookieNonce !== nonce) {
    console.error('Nonce mismatch', nonce, cookieNonce);
    res.sendStatus(500);
    return;
  }

  await ensureMemberOfEveryoneOrg(user_id);

  const tokenData: LoginTokenData = {
    user_id,
    name,
    email,
    picture,
  };

  res.clearCookie(NONCE_COOKIE_NAME);
  res.cookie(
    LOGIN_TOKEN_COOKIE_NAME,
    jwt.sign(tokenData, LOGIN_SIGNING_SECRET, {
      algorithm: 'HS512',
      expiresIn: LOGIN_EXPIRES_IN,
    }),
    COOKIE_OPTIONS,
  );

  res.send({ redirect: state });
}

function makeRedirectUri(req: Request) {
  return new URL('/slackRedirect', req.get('Referer') ?? '').toString();
}

async function ensureMemberOfEveryoneOrg(userID: string) {
  // Ensure the group exists
  await fetchCordRESTApi(`groups/${EVERYONE_ORG_ID}`, 'PUT', {
    name: EVERYONE_ORG_NAME,
  });
  // Make sure the user exists and is a member of the everyone org. Their
  // details are put into their token and get set that way, so we don't need to
  // actually set any fields here (which lets us do this unconditionally since
  // it won't overwrite anything).
  await fetchCordRESTApi(`users/${userID}`, 'PUT', {
    // Adding a user to a group they're already a member of is explicitly
    // documented as not an error, so we can do this unconditionally.
    addGroups: [EVERYONE_ORG_ID],
  });
}
