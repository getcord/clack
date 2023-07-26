export function checkForNotificationsPermissions(
  showNotifsRequestBanner: () => void,
) {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications.');
    return;
  }

  // Request permission for notifications
  if (Notification.permission !== 'granted') {
    showNotifsRequestBanner();
  }

  console.log({ permission: Notification.permission });
}

export async function requestNotificationsPermissions() {
  return Notification.requestPermission();
}

export function showNotification() {
  // Check if notifications are allowed
  if (Notification.permission === 'granted') {
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
}
