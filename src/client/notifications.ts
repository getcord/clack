import type { CoreNotificationData } from '@cord-sdk/types';

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

function notifHeaderString(header: CoreNotificationData['header']) {
  let result = '';
  for (const node of header) {
    if (node.type === 'user') {
      result += node.user.name;
    } else if (node.type === 'text') {
      result += node.text;
    }
  }

  return result;
}

function getThreadChannel(threadID: string): Promise<string> {
  return new Promise((resolve, _reject) => {
    const ref = window.CordSDK!.thread.observeThreadSummary(
      threadID,
      (summary) => {
        window.CordSDK!.thread.unobserveThreadSummary(ref);
        resolve(String(summary.location.channel));
      },
    );
  });
}

export async function showNotification(
  notif: CoreNotificationData,
  navigate: (to: string) => void,
) {
  // Check if notifications are allowed
  if (getBrowserNotificationPermission() !== 'granted') {
    return;
  }

  let url: string;
  let body: string | undefined;
  if (notif.attachment?.type === 'message') {
    const threadID = notif.attachment.message.threadID;
    const channel = await getThreadChannel(threadID);

    url = `/channel/${channel}/thread/${threadID}`;
    body = notif.attachment.message.plaintext;
  } else if (notif.attachment?.type === 'url') {
    url = notif.attachment.url;
  }

  // Create the notification
  const notification = new Notification(notifHeaderString(notif.header), {
    body,
    icon: './src/client/static/clack.png',
  });

  // Handle click event if desired
  notification.onclick = function () {
    window.focus(); // Bring the window into focus when the user clicks the notification
    navigate(url);
    notification.close(); // Close the notification
  };
}
