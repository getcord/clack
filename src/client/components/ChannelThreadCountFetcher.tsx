import { thread } from '@cord-sdk/react';

/**
 * Just a hack so that we can conditionally call a hook that was in Channels.tsx
 */

export function ChannelThreadCountFetcher({
  setHasUnread,
  channelID,
}: {
  setHasUnread: React.Dispatch<React.SetStateAction<boolean>>;
  channelID: string;
}) {
  const summary = thread.useThreadCounts({
    filter: {
      location: {
        value: { channel: channelID },
        partialMatch: true,
      },
    },
  });

  setHasUnread(!!summary?.new);

  return null;
}
