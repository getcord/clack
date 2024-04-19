import type { Request, Response, NextFunction } from 'express';
import { getClientAuthToken } from '@cord-sdk/server';
import * as jwt from 'jsonwebtoken';
import {
  AUTH_METHOD,
  CORD_APP_ID,
  CORD_SIGNING_SECRET,
  LOGIN_SIGNING_SECRET,
  LOGIN_TOKEN_COOKIE_NAME,
} from 'src/server/consts';
import type { LoginTokenData } from 'src/server/auth';
import { getCookie } from 'src/server/util';
import { makeSlackAuth } from 'src/server/auth/slack';
import { makeFakeAuth } from 'src/server/auth/fake';

function getAuthSystem() {
  if (AUTH_METHOD === 'slack') {
    return makeSlackAuth();
  }
  if (AUTH_METHOD === 'fake') {
    return makeFakeAuth();
  }
  throw new Error(
    'CLACK_AUTH_METHOD .env var must be set to "slack" or "fake"',
  );
}

const authSystem = getAuthSystem();

if (!CORD_APP_ID || !CORD_SIGNING_SECRET) {
  throw new Error('Missing keys from .env, is it set up properly?');
}

function getAndVerifyLoginTokenCookie(req: Request): LoginTokenData | null {
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
    const redirect = authSystem.getAuthRedirect(req, res);
    return res.send({ redirect });
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
