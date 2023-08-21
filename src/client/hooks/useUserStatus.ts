import { user } from '@cord-sdk/react';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useAPIUpdateFetch } from 'src/client/hooks/useAPIFetch';

export type UserStatus = {
  text?: string | null;
  emojiUrl?: string | null;
  emojiUnified?: string | null;
};
type UpdateUserStatus = () => void;

export function useUserStatus(): [
  status: UserStatus | null,
  setStatus: Dispatch<SetStateAction<UserStatus | null>>,
  updateUserStatus: UpdateUserStatus,
] {
  const [status, setStatus] = useState<UserStatus | null>(null);
  const viewer = user.useViewerData();
  const viewerID = viewer?.id;

  useEffect(() => {
    if (
      typeof viewer?.metadata.statusText === 'string' &&
      typeof viewer?.metadata.statusEmojiUrl === 'string' &&
      typeof viewer?.metadata.statusEmojiUnified === 'string'
    ) {
      setStatus({
        text: viewer.metadata.statusText,
        emojiUrl: viewer.metadata.statusEmojiUrl,
        emojiUnified: viewer.metadata.statusEmojiUnified,
      });
    }
  }, [viewer]);

  const updateUser = useAPIUpdateFetch();

  const updateUserStatus = () => {
    const body = {
      metadata: {
        statusText: status?.text ?? undefined,
        statusEmojiUrl: status?.emojiUrl ?? undefined,
        statusEmojiUnified: status?.emojiUnified ?? undefined,
      },
    };
    updateUser(`/users/${viewerID}`, 'PUT', body)
      .then((res) => res.json())
      .catch((e) => e);
  };

  return [status, setStatus, updateUserStatus];
}
