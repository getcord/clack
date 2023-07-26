import type { Request, Response } from 'express';
import { getClientAuthToken } from '@cord-sdk/server';
import * as cookie from 'cookie';
import { nanoid } from 'nanoid';
import * as url from 'url';
import * as Slack from '@slack/web-api';
import * as jwt from 'jsonwebtoken';

const slackClient = new Slack.WebClient();

const CORD_APP_ID = process.env.CORD_APP_ID!;
const CORD_SIGNING_SECRET = process.env.CORD_SIGNING_SECRET!;
const LOGIN_SIGNING_SECRET = CORD_SIGNING_SECRET; // TODO: should this be a different key?
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
const SLACK_TEAM = process.env.SLACK_TEAM!;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;

const NONCE_COOKIE_NAME = 'slack_login_nonce';
const LOGIN_TOKEN_COOKIE_NAME = 'login_token';

const LOGIN_EXPIRES_IN = 60 * 60 * 24; // 1 day

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

const ORG_ID = 'clack_all';
const ORG_NAME = 'All Clack Users';

export function handleGetToken(req: Request, res: Response) {
  const loginToken = getCookie(req, LOGIN_TOKEN_COOKIE_NAME);
  if (!loginToken) {
    return redirectToSlackLogin(req, res);
  }

  let user_id, name, email, picture;
  try {
    ({ user_id, name, email, picture } = jwt.verify(
      loginToken,
      LOGIN_SIGNING_SECRET,
    ) as LoginTokenData);
  } catch (e) {
    return redirectToSlackLogin(req, res);
  }

  const token = getClientAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET, {
    user_id,
    organization_id: ORG_ID,
    user_details: {
      name,
      email,
      profilePictureURL: picture,
    },
    organization_details: {
      name: ORG_NAME,
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
    redirect_uri: 'https://local.cord.com:3000/slackRedirect',
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
    {
      httpOnly: true,
      secure: true,
    },
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
      state: req.get('Referer'), // TODO: does this need to be signed?
      team: SLACK_TEAM,
      nonce,
      redirect_uri: makeRedirectUri(req),
    },
  });

  res.cookie(NONCE_COOKIE_NAME, nonce, { httpOnly: true, secure: true });
  res.send({ redirect });
}
