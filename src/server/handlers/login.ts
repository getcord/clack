import * as url from 'url';
import type { Request, Response, NextFunction } from 'express';
import { getClientAuthToken } from '@cord-sdk/server';
import * as cookie from 'cookie';
import { nanoid } from 'nanoid';
import * as Slack from '@slack/web-api';
import * as jwt from 'jsonwebtoken';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import {
  CORD_APP_ID,
  CORD_SIGNING_SECRET,
  EVERYONE_ORG_ID,
  EVERYONE_ORG_NAME,
} from 'src/server/consts';

const slackClient = new Slack.WebClient();

const LOGIN_SIGNING_SECRET = CORD_SIGNING_SECRET; // TODO: should this be a different key?
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
const SLACK_TEAM = process.env.SLACK_TEAM!;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;

const NONCE_COOKIE_NAME = 'slack_login_nonce';
const LOGIN_TOKEN_COOKIE_NAME = 'login_token';

const LOGIN_EXPIRES_IN = 60 * 60 * 24; // 1 day

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,

  // We need some amount of cross-site on our cookies. Setting `lax` would be
  // better but all the cookies are set and read due to ajax requests so we need
  // to do this. We should probably be smarter to avoid this.
  sameSite: 'none',
} as const;

if (
  !CORD_APP_ID ||
  !CORD_SIGNING_SECRET ||
  !SLACK_CLIENT_ID ||
  !SLACK_TEAM ||
  !SLACK_CLIENT_SECRET
) {
  throw new Error('Missing keys from .env, is it set up properly?');
}

type LoginTokenData = {
  user_id: string;
  name: string;
  email: string;
  picture: string;
};

export function getAndVerifyLoginTokenCookie(
  req: Request,
): LoginTokenData | null {
  const loginToken = getCookie(req, LOGIN_TOKEN_COOKIE_NAME);
  if (!loginToken) {
    return null;
  }

  try {
    return jwt.verify(loginToken, LOGIN_SIGNING_SECRET) as LoginTokenData;
  } catch (e) {
    return null;
  }
}

export function enforceLoginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const loginTokenData = getAndVerifyLoginTokenCookie(req);
  if (loginTokenData) {
    (req as any).loginTokenData = loginTokenData;
    next();
  } else {
    res.sendStatus(401);
  }
}

export function handleGetToken(req: Request, res: Response) {
  const loginTokenData = getAndVerifyLoginTokenCookie(req);
  if (!loginTokenData) {
    return redirectToSlackLogin(req, res);
  }
  const { user_id, name, email, picture } = loginTokenData;

  const token = getClientAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET, {
    user_id,
    user_details: {
      name,
      email,
      profilePictureURL: picture,
    },
  });

  res.send({ token, userID: user_id });
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

function getCookie(req: Request, name: string): string | undefined {
  return cookie.parse(req.header('Cookie') || '')[name];
}

function makeRedirectUri(req: Request) {
  return new URL('/slackRedirect', req.get('Referer') ?? '').toString();
}

function redirectToSlackLogin(req: Request, res: Response) {
  const nonce = nanoid(10);
  const redirect = url.format({
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

  res.cookie(NONCE_COOKIE_NAME, nonce, COOKIE_OPTIONS);
  res.send({ redirect });
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
