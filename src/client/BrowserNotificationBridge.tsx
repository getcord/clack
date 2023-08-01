import * as React from 'react';
import { notification } from '@cord-sdk/react';
import type { NotificationVariables } from '@cord-sdk/types';
import { showNotification } from 'src/client/notifications';

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
