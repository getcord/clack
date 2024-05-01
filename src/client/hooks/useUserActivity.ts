import { useEffect, useState } from 'react';
import { EVERYONE_ORG_ID } from 'src/common/consts';

export const localStorageKey = 'activity';

export type Activity = 'active' | 'away';
export type SetActivity = (
  status: Activity | ((previousStatus: Activity) => Activity),
) => void;

export function useUserActivity(): [
  activity: Activity,
  setActivity: SetActivity,
] {
  const [activity, setActivity] = useState<Activity>('away');

  useEffect(() => {
    setActivity(
      (window.localStorage.getItem(localStorageKey) as Activity) ?? 'away',
    );
  }, []);

  const setLocalStorageActivity: SetActivity = (updatedActivity) => {
    const newState =
      typeof updatedActivity === 'function'
        ? updatedActivity(activity)
        : updatedActivity;
    void window.CordSDK?.presence.setPresent(
      {
        page: 'clack',
      },
      {
        absent: updatedActivity !== 'active',
        groupID: EVERYONE_ORG_ID,
      },
    );
    window.localStorage.setItem(localStorageKey, newState);
    setActivity(newState);
  };

  return [activity, setLocalStorageActivity];
}
