import type { NotificationVariables } from '@cord-sdk/types';

export function getBrowserNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    // Really, unsupported, but same behaviour for us right now.
    return 'denied';
  }

  return Notification.permission;
}

export async function requestNotificationsPermissions() {
  return Notification.requestPermission();
}

function notifHeaderString(header: NotificationVariables['header']) {
  let result = '';
  for (const node of header) {
    if ('userID' in node) {
      result += node.userID;
    } else if ('text' in node) {
      result += node.text;
    }
  }

  return result;
}

export function showNotification(notif: NotificationVariables) {
  // Check if notifications are allowed
  if (getBrowserNotificationPermission() !== 'granted') {
    return;
  }

  // Create the notification
  const notification = new Notification('Clack', {
    body: notifHeaderString(notif.header),
    icon: './src/client/static/clack.png', // not working?
  });

  // Handle click event if desired
  notification.onclick = function () {
    window.focus(); // Bring the window into focus when the user clicks the notification
    notification.close(); // Close the notification
  };
}
