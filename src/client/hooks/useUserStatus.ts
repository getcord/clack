import { user } from '@cord-sdk/react';
import { useEffect, useState } from 'react';
import { useAPIUpdateFetch } from 'src/client/hooks/useAPIFetch';

type UpdateUserStatus = (newStatus: string | null) => void;

export function useUserStatus(): [
  status: string | null,
  updateUserStatus: UpdateUserStatus,
] {
  const [status, setStatus] = useState<string | null>(null);
  const viewer = user.useViewerData();
  const viewerID = viewer?.id;

  useEffect(() => {
    if (typeof viewer?.metadata.status === 'string') {
      setStatus(viewer.metadata.status);
    }
  }, [viewer]);

  const updateUser = useAPIUpdateFetch();

  const updateUserStatus: UpdateUserStatus = (newStatus) => {
    const body = {
      metadata: {
        status: newStatus ?? '',
      },
    };
    updateUser(`/users/${viewerID}`, 'PUT', body)
      .then((res) => res.json())
      .catch((e) => e);
  };

  return [status, updateUserStatus];
}
