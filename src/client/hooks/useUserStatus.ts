import { useEffect, useState } from 'react';

export const localStorageKey = 'status';

export type Status = 'active' | 'away';

export function useUserStatus(): [
  status: Status,
  setStatus: (status: Status) => void,
] {
  const [status, setStatus] = useState<Status>('away');

  useEffect(() => {
    setStatus(
      (window.localStorage.getItem(localStorageKey) as Status) ?? 'away',
    );
  }, []);

  const setLocalStorageStatus = (newStatus: Status) => {
    void window.CordSDK?.presence.setPresent(
      {
        page: 'clack',
      },
      {
        absent: newStatus !== 'active',
      },
    );
    window.localStorage.setItem(localStorageKey, newStatus);
    setStatus(newStatus);
  };

  return [status, setLocalStorageStatus];
}
