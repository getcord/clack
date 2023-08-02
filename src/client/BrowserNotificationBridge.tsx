import * as React from 'react';
import { notification } from '@cord-sdk/react';
import type { CoreNotificationData } from '@cord-sdk/types';
import { useNavigate } from 'react-router-dom';
import { showNotification } from 'src/client/notifications';

export function BrowserNotificationBridge() {
  const navigate = useNavigate();
  const { notifications } = notification.useData();

  const newestNotif = notifications[0] as CoreNotificationData | undefined;
  const prevNewestNotifIDRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (
      newestNotif &&
      prevNewestNotifIDRef.current &&
      newestNotif.id !== prevNewestNotifIDRef.current
    ) {
      void showNotification(newestNotif, navigate);
    }

    prevNewestNotifIDRef.current = newestNotif?.id;
  });

  return null;
}
