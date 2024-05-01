export const FRONT_END_HOST =
  process.env.CLACK_ENV === 'development'
    ? 'https://local.cord.com:7307'
    : 'https://clack.cord.com';
export const CORD_API_URL = 'https://api.staging.cord.com/';
export const CORD_APP_ID = process.env.CORD_APP_ID!;
export const CORD_SIGNING_SECRET = process.env.CORD_SIGNING_SECRET!;
export const EVERYONE_ORG_NAME = 'All Clack Users';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,

  // We need some amount of cross-site on our cookies. Setting `lax` would be
  // better but all the cookies are set and read due to ajax requests so we need
  // to do this. We should probably be smarter to avoid this.
  sameSite: 'none',
} as const;

export const LOGIN_SIGNING_SECRET = CORD_SIGNING_SECRET; // TODO: should this be a different key?
export const LOGIN_EXPIRES_IN = 60 * 60 * 24; // 1 day
export const LOGIN_TOKEN_COOKIE_NAME = 'login_token';

export const AUTH_METHOD = process.env.CLACK_AUTH_METHOD ?? 'slack';
