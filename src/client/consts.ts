export const API_HOST =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost:7309'
    : 'https://api.clack.cord.com';
export const FRONT_END_HOST =
  process.env.NODE_ENV === 'development'
    ? 'https://local.cord.com:7307'
    : 'https://clack.cord.com';
