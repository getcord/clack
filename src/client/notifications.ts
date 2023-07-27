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

export function showNotification() {
  // Check if notifications are allowed
  if (getBrowserNotificationPermission() !== 'granted') {
    return;
  }

  // Create the notification
  const notification = new Notification('New message!', {
    body: 'You have a new message on Clack',
    icon: './src/client/static/clack.png', // not working?
  });

  // Handle click event if desired
  notification.onclick = function () {
    window.focus(); // Bring the window into focus when the user clicks the notification
    notification.close(); // Close the notification
  };
}
