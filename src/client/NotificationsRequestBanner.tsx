import * as React from 'react';
import { styled } from 'styled-components';
import {
  getBrowserNotificationPermission,
  requestNotificationsPermissions,
} from 'src/client/notifications';

export function NotificationsRequestBanner() {
  const [showBanner, setShowBanner] = React.useState(
    getBrowserNotificationPermission() === 'default',
  );

  if (!showBanner) {
    return null;
  }

  return (
    <Container
      onClick={() => {
        requestNotificationsPermissions()
          .then((_permission) => {
            setShowBanner(false);
          })
          .catch(console.error);
      }}
    >
      Click here to enable browser notifications from Clack
    </Container>
  );
}

const Container = styled.div({
  marginTop: 'auto',
  backgroundColor: 'yellow',
  padding: '4px',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    textDecoration: 'underline',
  },
});
