import { CordContext, user } from '@cord-sdk/react';
import { useCallback, useContext, useMemo } from 'react';
import { useLazyAPIFetch } from 'src/client/hooks/useAPIFetch';

export function useMutedChannels(): [
  Set<string> | undefined,
  (channelID: string) => void,
] {
  const { userID } = useContext(CordContext);
  const viewerData = user.useViewerData();

  const update = useLazyAPIFetch();

  const muted = useMemo(
    () =>
      viewerData
        ? new Set<string>(JSON.parse(String(viewerData.metadata.muted ?? '[]')))
        : undefined,
    [viewerData],
  );

  const toggleMute = useCallback(
    (channelID: string) => {
      if (muted === undefined) {
        return;
      }

      const newMuted = new Set(muted);
      if (newMuted.has(channelID)) {
        newMuted.delete(channelID);
      } else {
        newMuted.add(channelID);
      }

      void update(`/users/${userID}`, 'PUT', {
        metadata: {
          ...viewerData?.metadata,
          muted: JSON.stringify([...newMuted]),
        },
      });
    },
    [muted, update, userID, viewerData?.metadata],
  );

  return [muted, toggleMute];
}
