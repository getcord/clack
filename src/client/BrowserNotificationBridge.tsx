import * as React from 'react';
import { notification } from '@cord-sdk/react';
import { showNotification } from './notifications';
import type { NotificationVariables } from '@cord-sdk/types';

export function BrowserNotificationBridge() {
  const { notifications } = notification.useData();
  const newestNotif = notifications[0] as NotificationVariables | undefined;
  const prevNewestNotifIDRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (
      newestNotif &&
      prevNewestNotifIDRef.current &&
      newestNotif.id !== prevNewestNotifIDRef.current
    ) {
      showNotification(newestNotif);
    }

    prevNewestNotifIDRef.current = newestNotif?.id;
  });

  return null;
}
