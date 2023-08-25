import { user } from '@cord-sdk/react';
import { useEffect, useState } from 'react';
import { useAPIUpdateFetch } from 'src/client/hooks/useAPIFetch';

export type UserStatus = {
  /**
   * the text or description of the status;
   */
  text?: string | null;
  /**
   * Unfortunately the unified string is not unicode, so the URL is used
   * to render as an image next to a message author.
   */
  emojiUrl?: string | null;
  /**
   * Used to render emoji's using the package's Emoji component
   */
  emojiUnified?: string | null;
};
type UpdateUserStatus = (newStatus: UserStatus | null) => void;

export function useUserStatus(
  /**
   * @param userID optional, if no ID is passed then this will fall back to the viewer's status.
   */
  userID?: string,
): [status: UserStatus | null, updateUserStatus: UpdateUserStatus] {
  const [status, setStatus] = useState<UserStatus | null>(null);
  const viewerData = user.useViewerData();
  const userData = user.useUserData(userID || '');
  const ID = userID ? userData?.id : viewerData?.id;
  const metadata = userID ? userData?.metadata : viewerData?.metadata;

  useEffect(() => {
    if (
      metadata &&
      typeof metadata.statusText === 'string' &&
      typeof metadata.statusEmojiUrl === 'string' &&
      typeof metadata.statusEmojiUnified === 'string'
    ) {
      setStatus({
        text: metadata.statusText,
        emojiUrl: metadata.statusEmojiUrl,
        emojiUnified: metadata.statusEmojiUnified,
      });
    }
  }, [metadata]);

  const updateUser = useAPIUpdateFetch();

  const updateUserStatus: UpdateUserStatus = (newStatus) => {
    const body = {
      metadata: {
        statusText: newStatus?.text ?? undefined,
        statusEmojiUrl: newStatus?.emojiUrl ?? undefined,
        statusEmojiUnified: newStatus?.emojiUnified ?? undefined,
      },
    };
    updateUser(`/users/${ID}`, 'PUT', body)
      .then(() => setStatus(newStatus))
      .catch((e) => e);
  };

  return [status, updateUserStatus];
}
