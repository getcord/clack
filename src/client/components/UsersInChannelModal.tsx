import React from 'react';
import styled from 'styled-components';
import {
  CordContext,
  Avatar as DefaultAvatar,
  presence,
} from '@cord-sdk/react';
import type { ClientUserData } from '@cord-sdk/types';
import type { Channel } from 'src/client/consts/Channel';
import { Colors } from 'src/client/consts/Colors';
import { ActiveBadge } from 'src/client/components/ActiveBadge';
import { Name } from 'src/client/components/Name';
import { XIcon } from 'src/client/components/Buttons';

interface UsersInChannelModalProps {
  onClose: () => void;
  channel: Channel;
  users: ClientUserData[];
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
          <Heading># {channel.id}</Heading>
          <CloseButton onClick={onClose}>
            <XIcon />
          </CloseButton>
        </Header>

        <UsersList>
          {users.map((user) => {
            const isUserPresent = usersPresent?.some(
              (presence) => presence.id === user.id,
            );
            return (
              <UserDetails key={user.id}>
                <Avatar userId={user.id} enableTooltip />
                {/* //todo: fill short name values in db console? */}
                <Name $variant="main">
                  {user.shortName || user.name}
                  {cordUserID === user.id ? ' (you)' : ''}
                </Name>
                <ActiveBadge $isActive={!!isUserPresent} />
                <Name $variant="simple">{user?.name}</Name>
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
  overflow: 'auto',
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
