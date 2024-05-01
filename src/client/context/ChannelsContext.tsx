import { user } from '@cord-sdk/react';
import * as React from 'react';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useMemo } from 'react';
import type { Channel } from 'src/client/consts/Channel';
import {
  EVERYONE_ORG_ID,
  DM_CHANNEL_PREFIX,
  isDirectMessageChannel,
} from 'src/common/consts';
import { useLazyAPIFetch } from 'src/client/hooks/useAPIFetch';

type ChannelsContextType = {
  channels: Channel[];
  refetch: () => void;
};

export const ChannelsContext = createContext<ChannelsContextType>({
  channels: [],
  refetch: () => {},
});

type ChannelsProviderProps = PropsWithChildren<{
  channelID: string;
  setChannel: (channel: Channel) => void;
}>;

export function ChannelsProvider({
  channelID,
  setChannel,
  children,
}: ChannelsProviderProps) {
  const { channels, refetch } = useChannels();
  useEffect(() => {
    setChannel(
      channels.find((c) => c.id === channelID) ?? {
        id: '',
        name: '',
        org: EVERYONE_ORG_ID,
      },
    );
  }, [channelID, channels, setChannel]);
  return (
    <ChannelsContext.Provider value={{ channels, refetch }}>
      {children}
    </ChannelsContext.Provider>
  );
}

function useChannels(): { channels: Channel[]; refetch: () => void } {
  const [channelFetchResponse, setChannelFetchResponse] = React.useState<
    Record<string, string>
  >({});

  const fetch = useLazyAPIFetch();

  const fetchChannels = useCallback(
    () =>
      void fetch('/channels', 'GET')
        .then((allChannelsToOrg: { string: string }) => {
          if (allChannelsToOrg) {
            setChannelFetchResponse(allChannelsToOrg);
          }
        })
        .catch((e) => console.error(e)),
    [fetch],
  );

  useEffect(() => {
    fetchChannels();
    // Refetch channels every 5 mins in case someone else added one
    const int = setInterval(
      () => {
        void fetchChannels();
      },
      1000 * 60 * 5,
    );

    return () => clearInterval(int);
  }, [fetchChannels]);

  const userIDsToQuery = useMemo(() => {
    const userIDs = new Set<string>();
    for (const key in channelFetchResponse) {
      if (isDirectMessageChannel(key)) {
        key
          .substring(DM_CHANNEL_PREFIX.length)
          .split(',')
          .forEach((userID) => userIDs.add(userID));
      }
    }
    return [...userIDs];
  }, [channelFetchResponse]);

  const viewer = user.useViewerData();
  const userData = user.useUserData(userIDsToQuery);

  return useMemo(() => {
    if (!viewer || !userIDsToQuery.every((userID) => userID in userData)) {
      return { channels: [], refetch: fetchChannels };
    }
    const channels: Channel[] = [];
    for (const key in channelFetchResponse) {
      if (isDirectMessageChannel(key)) {
        const name = key
          .substring(DM_CHANNEL_PREFIX.length)
          .split(',')
          .filter((userID) => userID !== viewer.id)
          .map((userID) => userData[userID]!.displayName)
          .join(', ');
        channels.push({ id: key, name, org: key });
      } else {
        channels.push({ id: key, name: key, org: channelFetchResponse[key] });
      }
    }
    return { channels, refetch: fetchChannels };
  }, [viewer, userIDsToQuery, fetchChannels, userData, channelFetchResponse]);
}
