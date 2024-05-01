export const DM_CHANNEL_PREFIX = 'dm:';
export const EVERYONE_ORG_ID = 'clack_all';

export function isDirectMessageChannel(id: string) {
  return id.startsWith(DM_CHANNEL_PREFIX);
}
