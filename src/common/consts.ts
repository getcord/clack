export const DM_CHANNEL_PREFIX = 'dm:';
export const EVERYONE_ORG_ID = 'clack_all';

export function isDirectMessageChannel(id: string) {
  return id.startsWith(DM_CHANNEL_PREFIX);
}

export function extractUsersFromDirectMessageChannel(id: string) {
  if (!isDirectMessageChannel(id)) {
    throw new Error('Only call this function with direct message channels');
  }
  return id.substring(DM_CHANNEL_PREFIX.length).split(',').sort();
}
