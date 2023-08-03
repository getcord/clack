import { user } from '@cord-sdk/react';
import { useEffect, useState } from 'react';
import { useAPIUpdateFetch } from 'src/client/hooks/useAPIFetch';

export function useUserStatus(): [
  status: string | null,
  updateUserStatus: (newStatus: string) => Promise<any>,
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

  const updateUserStatus = async (newStatus: string) => {
    const body = {
      metadata: {
        status: newStatus,
      },
    };
    return updateUser(`/users/${viewerID}`, 'PUT', body)
      .then((res) => res)
      .then((res) => res.json())
      .catch((e) => e);
  };

  return [status, updateUserStatus];
}
