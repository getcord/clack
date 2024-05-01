import type { Dispatch, SetStateAction } from 'react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { user, Avatar as DefaultAvatar } from '@cord-sdk/react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';
import { XIcon } from 'src/client/components/Buttons';
import { Modal as DefaultModal } from 'src/client/components/Modal';
import { useLazyAPIFetch } from 'src/client/hooks/useAPIFetch';
import { ChannelsContext } from 'src/client/context/ChannelsContext';
import { EVERYONE_ORG_ID } from 'src/client/consts/consts';
import { Colors } from 'src/client/consts/Colors';
import { Name } from 'src/client/components/Name';
import { DM_CHANNEL_PREFIX } from 'src/common/consts';

export function AddDirectMessageModal({
  isOpen,
  setModalOpen,
}: {
  isOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    groupMembers: allGroupMembers,
    loading,
    hasMore,
    fetchMore,
  } = user.useGroupMembers({
    groupID: EVERYONE_ORG_ID,
  });
  const viewer = user.useViewerData();

  useEffect(() => {
    if (!loading && hasMore) {
      void fetchMore(50);
    }
  }, [hasMore, loading, fetchMore]);

  const addableUsers = useMemo(() => {
    return allGroupMembers
      .filter((gm) => gm.id !== viewer?.id)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allGroupMembers, viewer?.id]);

  const [usersToAdd, setUsersToAdd] = useState<string[]>([]);

  const { refetch: refetchChannels } = useContext(ChannelsContext);
  const update = useLazyAPIFetch();
  const navigate = useNavigate();

  const createDM = useCallback(() => {
    if (viewer === undefined || usersToAdd.length === 0) {
      return;
    }
    const channelUsers = [viewer.id, ...usersToAdd];
    const channelName = DM_CHANNEL_PREFIX + channelUsers.sort().join(',');

    void update(`/channels/${encodeURIComponent(channelName)}`, 'PUT', {
      isPrivate: false,
    }).then(() => {
      setModalOpen(false);
      setUsersToAdd([]);
      refetchChannels();
      navigate(`/channel/${channelName}`);
    });
  }, [navigate, refetchChannels, setModalOpen, update, usersToAdd, viewer]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setModalOpen(false)}>
        <Box onClick={(e) => e.stopPropagation()}>
          <Header>
            <Heading>
              <DirectMessageIcon />
              New direct message
            </Heading>
            <CloseButton onClick={() => setModalOpen(false)}>
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
                    <Name $variant="main">{user.displayName}</Name>
                    <Name $variant="simple">{user.secondaryDisplayName}</Name>
                  </UserDetails>
                </Label>
              );
            })}
          </UsersList>
          <Footer>
            <AddButton onClick={createDM} disabled={usersToAdd.length === 0}>
              Create
            </AddButton>
          </Footer>
        </Box>
      </Modal>
    </>
  );
}

const Modal = styled(DefaultModal)`
  display: flex;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: auto;
`;

const Box = styled.div({
  backgroundColor: 'white',
  borderRadius: '12px',
  color: 'black',
  gap: '12px',
  minWidth: '550px',
  maxHeight: '700px',
  minHeight: '500px',
  margin: 'auto',
});

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  padding: '24px 24px',
  borderBottom: `1px solid ${Colors.gray_light}`,
});

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
  '&:disabled': {
    color: '#ccc',
    cursor: 'inherit',
    background: '#ddd',
    boxShadow: 'none',
  },
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

const Heading = styled.h2({
  display: 'flex',
  marginTop: 0,
  alignItems: 'center',
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

const DirectMessageIcon = styled(ChatBubbleLeftRightIcon)`
  margin-right: 4px;
  width: 32px;
  height: 32px;
`;
