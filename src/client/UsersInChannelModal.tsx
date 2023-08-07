import React from 'react';
import styled from 'styled-components';
import {
  CordContext,
  Avatar as DefaultAvatar,
  presence,
  user,
} from '@cord-sdk/react';
import { Colors } from 'src/client/Colors';
import { ActiveBadge } from 'src/client/ActiveBadge';
import { Name } from 'src/client/Name';
import { XIcon } from 'src/client/SetToActiveModal';

interface UsersInChannelModalProps {
  onClose: () => void;
  channel: string;
  users: (string | number)[];
}

export function UsersInChannelModal({
  onClose,
  users,
  channel,
}: UsersInChannelModalProps) {
  const usersPresent = presence.useLocationData(
    { page: 'clack' },
    { exclude_durable: true, partial_match: true },
  );
  const { userID: cordUserID } = React.useContext(CordContext);

  return (
    <Modal>
      <Box>
        <Header>
          <Heading># {channel}</Heading>
          <CloseButton onClick={onClose}>
            <XIcon />
          </CloseButton>
        </Header>

        <UsersList>
          {users.map((userID) => {
            const id = userID.toString();
            const isUserPresent = usersPresent?.some(
              (presence) => presence.id === id,
            );
            const userData = user.useUserData(id);
            if (!userData) {
              return <></>;
            }
            return (
              <UserDetails key={id}>
                <Avatar userId={id} enableTooltip />
                {/* //todo: fill short name values in db console? */}
                <Name $variant="main">
                  {userData?.shortName || userData?.name}
                  {cordUserID === id ? ' (you)' : ''}
                </Name>
                <ActiveBadge $isActive={!!isUserPresent} />
                <Name $variant="simple">{userData?.name}</Name>
              </UserDetails>
            );
          })}
        </UsersList>
      </Box>
    </Modal>
  );
}

const Avatar = styled(DefaultAvatar)`
  grid-area: avatar;
  .cord-avatar-container {
    width: 36px;
    height: 36px;
  }
`;

const Modal = styled.div({
  position: 'absolute',
  height: '100vh',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Box = styled.div({
  backgroundColor: 'white',
  borderRadius: '12px',
  color: 'black',
  gap: '12px',
  minWidth: '550px',
  maxHeight: '700px',
  minHeight: '500px',
});

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  padding: '24px 24px',
  borderBottom: `1px solid ${Colors.gray_light}`,
});

const Heading = styled.h2({
  marginTop: 0,
});

const UsersList = styled.div({
  fontSize: '13px',
  overflow: 'scroll',
  maxHeight: '60vh',
  borderRadius: '12px',
});

const UserDetails = styled.div({
  display: 'flex',
  backgroundColor: 'white',
  padding: '12px 28px',
  '&:hover': {
    backgroundColor: `${Colors.gray_highlight}`,
  },
  // todo: update once we have profile details like role
  alignItems: 'center',
});

const CloseButton = styled.button({
  all: 'unset',
  cursor: 'pointer',
  color: Colors.gray_dark,
  justifySelf: 'end',
  height: 'fit-content',
  lineHeight: 0,
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: Colors.gray_highlight,
  },
});
