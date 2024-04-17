export const FRONT_END_HOST =
  process.env.CLACK_ENV === 'development'
    ? 'https://local.cord.com:7307'
    : 'https://clack.cord.com';
export const CORD_API_URL = 'https://api.staging.cord.com/';
export const CORD_APP_ID = process.env.CORD_APP_ID!;
export const CORD_SIGNING_SECRET = process.env.CORD_SIGNING_SECRET!;
export const EVERYONE_ORG_ID = 'clack_all';
export const EVERYONE_ORG_NAME = 'All Clack Users';
