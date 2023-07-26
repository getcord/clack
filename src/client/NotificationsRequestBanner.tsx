import * as React from 'react';
import { requestNotificationsPermissions } from 'src/client/notifications';
import { styled } from 'styled-components';

export const NotificationsRequestBanner = ({
  setShowBanner,
}: {
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Container
      onClick={() =>
        requestNotificationsPermissions()
          .then((permission) => {
            if (permission === 'granted') {
              console.log('Notifications permission granted');
              setShowBanner(false);
            } else {
              console.log(
                'Notifications permission denied - the browser may have done this automatically',
              );
              setShowBanner(false);
            }
          })
          .catch(console.error)
      }
    >
      <span>Click here to enable browser notifications from Clack</span>
    </Container>
  );
};

const Container = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'yellow',
  padding: '4px',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    textDecoration: 'underline',
  },
});
