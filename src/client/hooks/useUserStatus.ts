import { useEffect, useState } from 'react';

export const localStorageKey = 'status';

export type Status = 'active' | 'away';
export type SetStatus = (
  status: Status | ((previousStatus: Status) => Status),
) => void;

export function useUserStatus(): [status: Status, setStatus: SetStatus] {
  const [status, setStatus] = useState<Status>('away');

  useEffect(() => {
    setStatus(
      (window.localStorage.getItem(localStorageKey) as Status) ?? 'away',
    );
  }, []);

  const setLocalStorageStatus: SetStatus = (newStatus) => {
    const newState =
      typeof newStatus === 'function' ? newStatus(status) : newStatus;
    void window.CordSDK?.presence.setPresent(
      {
        page: 'clack',
      },
      {
        absent: newStatus !== 'active',
      },
    );
    window.localStorage.setItem(localStorageKey, newState);
    setStatus(newState);
  };

  return [status, setLocalStorageStatus];
}
