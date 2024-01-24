import { thread } from '@cord-sdk/react';

/**
 * Just a hack so that we can conditionally call a hook that was in Channels.tsx
 */

export function ChannelThreadCountFetcher({
  setHasUnread,
  channelID,
  isMuted,
}: {
  setHasUnread: React.Dispatch<React.SetStateAction<boolean>>;
  channelID: string;
  isMuted: boolean;
}) {
  const summary = thread.useThreadCounts({
    filter: {
      location: {
        value: { channel: channelID },
        partialMatch: true,
      },
    },
  });

  setHasUnread(!isMuted && !!summary?.new);

  return null;
}
