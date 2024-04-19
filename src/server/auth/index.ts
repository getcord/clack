import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {
  COOKIE_OPTIONS,
  EVERYONE_ORG_ID,
  EVERYONE_ORG_NAME,
  LOGIN_EXPIRES_IN,
  LOGIN_SIGNING_SECRET,
  LOGIN_TOKEN_COOKIE_NAME,
} from 'src/server/consts';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export type AuthSystem = {
  getAuthRedirect: (req: Request, res: Response) => string;
};

export type LoginTokenData = {
  user_id: string;
  name: string;
  email?: string;
  picture: string;
};

export async function ensureMemberOfEveryoneOrg(userID: string) {
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

export function addLoginCookie(res: Response, tokenData: LoginTokenData) {
  res.cookie(
    LOGIN_TOKEN_COOKIE_NAME,
    jwt.sign(tokenData, LOGIN_SIGNING_SECRET, {
      algorithm: 'HS512',
      expiresIn: LOGIN_EXPIRES_IN,
    }),
    COOKIE_OPTIONS,
  );
}
