import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  CordContext,
  Avatar as DefaultAvatar,
  presence,
  user,
} from '@cord-sdk/react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon, HashtagIcon } from '@heroicons/react/24/solid';
import type { ClientUserData } from '@cord-sdk/types';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';
import type { Channel } from 'src/client/consts/Channel';
import { Colors } from 'src/client/consts/Colors';
import { ActiveBadge } from 'src/client/components/ActiveBadge';
import { Name } from 'src/client/components/Name';
import { XIcon } from 'src/client/components/Buttons';
import { useLazyAPIFetch } from 'src/client/hooks/useAPIFetch';
import { EVERYONE_ORG_ID, isDirectMessageChannel } from 'src/common/consts';

type UsersInChannelModalProps = {
  onClose: () => void;
  channel: Channel;
  users: ClientUserData[];
};

export function UsersInChannelModal({
  onClose,
  users,
  channel,
}: UsersInChannelModalProps) {
  const usersPresent = presence.useLocationData(
    { page: 'clack' },
    { exclude_durable: true, partial_match: true },
  );
  const [showAddUsersModal, setShowAddUsersModal] = React.useState(false);

  return (
    <>
      <Modal $order={1}>
        <Box>
          <Header>
            <Heading>
              {isDirectMessageChannel(channel.id) ? (
                <ChatBubbleLeftRightIcon
                  width={20}
                  style={{ padding: '1px', marginRight: '4px' }}
                />
              ) : channel.org === EVERYONE_ORG_ID ? (
                <HashtagIcon width={20} style={{ padding: '1px' }} />
              ) : (
                <LockClosedIcon
                  width={20}
                  style={{ padding: '1px', marginRight: '2px' }}
                />
              )}
              {channel.name}
            </Heading>
            <CloseButton onClick={onClose}>
              <XIcon />
            </CloseButton>
          </Header>
          <UsersList>
            {/* Show the Add People modal option if this is a private org */}
            {channel.org !== EVERYONE_ORG_ID &&
              !isDirectMessageChannel(channel.id) && (
                <UserDetails onClick={() => setShowAddUsersModal(true)}>
                  <AddPeopleIconWrapper>
                    <UserPlusIcon
                      width={32}
                      height={32}
                      style={{
                        backgroundColor: '#e8f5fa',
                        color: 'rgba(18,100,163,1)',
                      }}
                    />
                  </AddPeopleIconWrapper>
                  <Name $variant="main">Add people</Name>
                </UserDetails>
              )}
            {users.map((user) => {
              const isUserPresent = usersPresent?.some(
                (presence) => presence.id === user.id,
              );
              return (
                <UserRow
                  key={user.id}
                  channel={channel}
                  isUserPresent={!!isUserPresent}
                  user={user}
                />
              );
            })}
          </UsersList>
        </Box>
      </Modal>
      {showAddUsersModal && (
        <AddUsersToChannelModal
          channel={channel}
          onClose={() => setShowAddUsersModal(false)}
          existingUsers={users.map((u) => u.id)}
        />
      )}
    </>
  );
}

function UserRow({
  channel,
  isUserPresent,
  user,
}: {
  channel: Channel;
  isUserPresent: boolean;
  user: ClientUserData;
}) {
  const { userID: cordUserID } = React.useContext(CordContext);
  const [showDelete, setShowDelete] = useState(false);

  const update = useLazyAPIFetch();

  return (
    <>
      <UserDetails
        key={user.id}
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
      >
        <Avatar userId={user.id} enableTooltip />
        {/* //todo: fill short name values in db console? */}
        <Name $variant="main">
          {user.shortName || user.name}
          {cordUserID === user.id ? ' (you)' : ''}
        </Name>
        <ActiveBadge $isActive={isUserPresent} />
        <Name $variant="simple">{user?.name}</Name>
        {showDelete &&
          !isDirectMessageChannel(channel.id) &&
          channel.org !== EVERYONE_ORG_ID && (
            // TODO: the org members API currently doesn't have subscriptions, so
            // it looks like nothing's happened in the FE atm
            <DeleteButton
              onClick={() => {
                void update(`/channelMembers/${channel.org}`, 'DELETE', {
                  userIDs: [user.id],
                });
              }}
            >
              Remove
            </DeleteButton>
          )}
      </UserDetails>
    </>
  );
}

type AddUsersToChannelModalProps = {
  onClose: () => void;
  channel: Channel;
  existingUsers: string[];
};

function AddUsersToChannelModal({
  onClose,
  existingUsers,
  channel,
}: AddUsersToChannelModalProps) {
  const {
    groupMembers: allGroupMembers,
    loading,
    hasMore,
    fetchMore,
  } = user.useGroupMembers({
    groupID: EVERYONE_ORG_ID,
  });

  useEffect(() => {
    if (!loading && hasMore) {
      void fetchMore(50);
    }
  }, [hasMore, loading, fetchMore]);

  const addableUsers = useMemo(() => {
    return allGroupMembers
      .filter((gm) => !existingUsers.includes(gm.id))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allGroupMembers, existingUsers]);

  const [usersToAdd, setUsersToAdd] = useState<string[]>([]);

  const update = useLazyAPIFetch();

  // TODO: the org members API currently doesn't have subscriptions, so
  // it looks like nothing's happened in the FE atm
  const addUsers = useCallback(() => {
    void update(`/channelMembers/${channel.org}`, 'PUT', {
      userIDs: usersToAdd,
    }).then(() => onClose());
  }, [channel.org, onClose, update, usersToAdd]);

  return (
    // This is a modal stacked on top of another modal
    <Modal $order={2}>
      <Box>
        <Header>
          <Heading>
            Add people to{' '}
            {channel.org === EVERYONE_ORG_ID ? (
              <HashtagIcon width={20} style={{ padding: '1px' }} />
            ) : (
              <LockClosedIcon
                width={20}
                style={{ padding: '1px', marginRight: '2px' }}
              />
            )}{' '}
            {channel.id}
          </Heading>
          <CloseButton onClick={onClose}>
            <XIcon />
          </CloseButton>
        </Header>
        <UsersList>
          {addableUsers.map((user) => {
            return (
              <Label key={user.id}>
                <UserDetails>
                  <Checkbox
                    id={`add-${user.id}`}
                    type="checkbox"
                    value={user.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUsersToAdd((prevState) => [...prevState, user.id]);
                      } else {
                        setUsersToAdd((prevState) =>
                          prevState.filter((u) => u !== user.id),
                        );
                      }
                    }}
                  />
                  <Avatar userId={user.id} enableTooltip />
                  <Name $variant="main">{user.shortName || user.name}</Name>
                  <Name $variant="simple">{user.name}</Name>
                </UserDetails>
              </Label>
            );
          })}
        </UsersList>
        <Footer>
          <AddButton onClick={addUsers}>Add</AddButton>
        </Footer>
      </Box>
    </Modal>
  );
}
const AddButton = styled.button({
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007a5a',
  color: '#ffffff',
  padding: '0 12px 1px',
  fontSize: '15px',
  height: '36px',
  minWidth: '80px',
  boxShadow: 'none',
  fontWeight: '700',
  transition: 'all 80ms linear',
  cursor: 'pointer',
  '&:hover': {
    background: '#148567',
    boxShadow: '0 1px 4px #0000004d',
  },
});

const DeleteButton = styled.button({
  backgroundColor: 'rgba(224,30,90)',
  border: 'none',
  borderRadius: '4px',
  boxShadow: 'none',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '700',
  height: '36px',
  marginLeft: 'auto',
  minWidth: '80px',
  padding: '0 12px 1px',
  transition: 'all 80ms linear',
  '&:hover': {
    background: '#e23067',
    boxShadow: '0 1px 4px #0000004d',
  },
});

const AddPeopleIconWrapper = styled.div({
  alignItems: 'center',
  backgroundColor: '#e8f5fa',
  display: 'flex',
  height: '36px',
  justifyContent: 'center',
  width: '36px',
});

const Checkbox = styled.input({
  marginRight: '16px',
  cursor: 'pointer',
});

const Label = styled.label({
  cursor: 'pointer',
});

const Footer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  padding: '24px 24px',
  borderTop: `1px solid ${Colors.gray_light}`,
});

const Avatar = styled(DefaultAvatar)`
  grid-area: avatar;
  .cord-avatar-container {
    width: 36px;
    height: 36px;
  }
`;

const Modal = styled.div<{ $order: number }>(({ $order }) => ({
  position: 'absolute',
  height: '100vh',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: $order * 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

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
  display: 'flex',
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
  cursor: 'pointer',
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
