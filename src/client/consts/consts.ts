export const API_HOST = window.location.host.includes('local')
  ? 'https://localhost:7309'
  : 'https://api.clack.cord.com';

export const FRONT_END_HOST = window.location.host.includes('local')
  ? 'https://local.cord.com:7307'
  : 'https://clack.cord.com';

export const BREAKPOINTS_PX = {
  FULLSCREEN_THREADS: 1200,
  COLLAPSE_SIDEBAR: 768,
};
