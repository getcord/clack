import * as React from 'react';
import { Avatar as DefaultAvatar, presence } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, HashtagIcon } from '@heroicons/react/20/solid';
import { Modal } from 'src/client/components/Modal';
import { useUserStatus } from 'src/client/hooks/useUserStatus';
import { SetStatusMenu } from 'src/client/components/SetStatus';
import { useUserActivity } from 'src/client/hooks/useUserActivity';
import { ActiveBadge as DefaultActiveBadge } from 'src/client/components/ActiveBadge';
import { SetToActiveModal } from 'src/client/components/SetToActiveModal';
import { UserPreferencesDropdown } from 'src/client/components/UserPreferenceDropdown';
import { SearchBar } from 'src/client/components/SearchBar';
import { BREAKPOINTS_PX } from 'src/client/consts/consts';

type ModalState = null | 'SET_STATUS' | 'PREFERENCES';

export const Topbar = ({
  userID,
  className,
  setShowSidebar,
}: {
  userID?: string;
  className?: string;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { channelID: channelIDParam } = useParams();
  const navigate = useNavigate();
  const channelID = channelIDParam ?? 'general';

  const [isActive, setIsActive] = useUserActivity();
  const [status, updateStatus] = useUserStatus();
  const present = presence.useLocationData(
    { page: 'clack' },
    { exclude_durable: false, partial_match: true },
  );
  const [modalState, setModalState] = React.useState<ModalState>(null);
  // this is not included in the modalState state as it's whether it *should* show,
  // not whether it *is* showing
  const [shouldShowActiveModal, setShouldShowActiveModal] =
    React.useState(true);

  const activeModalPreference =
    window.localStorage.getItem('dont-ask-again') === 'true' ? true : false;

  const isPresent = React.useMemo(
    () => !!present?.find((user) => user.id === userID),
    [present, userID],
  );

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setShouldShowActiveModal(false);
    setIsActive('away');
  };

  const onSetToActive: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsActive('active');
    setShouldShowActiveModal(false);
    void window.CordSDK?.presence.setPresent({ page: 'clack' });
  };

  const onAvatarClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setModalState((prev) => (prev === 'PREFERENCES' ? null : 'PREFERENCES'));
    setShouldShowActiveModal(false);
  };

  return (
    <Container className={className}>
      <GoBack onClick={() => navigate(`/channel/${channelID}`)}>
        <ChevronLeftIcon width={16} height={16} />
      </GoBack>
      <ChannelsList onClick={() => setShowSidebar?.((prev) => !prev)}>
        <HashtagIcon width={16} height={16} />
      </ChannelsList>
      <SearchBar />
      <AvatarWrapper onClick={onAvatarClick}>
        {userID && <Avatar userId={userID} enableTooltip />}
      </AvatarWrapper>
      <ActiveBadge className={className} $isActive={isActive === 'active'} />
      <Modal
        isOpen={modalState === 'PREFERENCES'}
        onClose={() => setModalState(null)}
      >
        <PreferencesDropdown
          openStatusModal={(e) => {
            e.stopPropagation();
            setModalState('SET_STATUS');
          }}
          status={status}
          activity={isActive}
          setActivity={setIsActive}
          onClose={() => setModalState(null)}
          updateStatus={updateStatus}
        />
      </Modal>
      {isPresent &&
      isActive !== 'active' &&
      shouldShowActiveModal &&
      !activeModalPreference ? (
        <SetToActiveModal
          onClose={onCancel}
          onCancel={onCancel}
          onSetToActive={onSetToActive}
        />
      ) : null}
      <DarkBGModal
        isOpen={modalState === 'SET_STATUS'}
        onClose={() => setModalState(null)}
      >
        <SetStatusMenu
          status={status}
          updateStatus={updateStatus}
          onCancel={() => setModalState(null)}
          onClose={() => setModalState(null)}
        />
      </DarkBGModal>
    </Container>
  );
};

const Button = styled.button`
  align-items: center;
  background: none;
  border-radius: 4px;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: none;
  flex-shrink: 0;
  font: inherit;
  height: 26px;
  justify-content: center;
  line-height: inherit;
  margin-left: 8px;
  opacity: 0.8;
  overflow: initial;
  padding: 0;
  text-align: initial;
  vertical-align: initial;
  width: 26px;

  &:hover {
    background: #5c3d5e;
  }
`;

const GoBack = styled(Button)`
  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    .openThread & {
      display: flex;
    }
  }
`;

const ChannelsList = styled(Button)`
  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    display: flex;

    .openThread & {
      display: none;
    }
  }
`;

const Container = styled.div({
  position: 'relative',
  color: '#f00',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingInlineEnd: '12px',
  zIndex: 3,
});

const DarkBGModal = styled(Modal)`
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarWrapper = styled.div({});

const Avatar = styled(DefaultAvatar)`
  .cord-avatar-container {
    width: 26px;
    height: 26px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      inset: 0;
    }
    &:hover {
      &:after {
        background-color: white;
        opacity: 0.3;
      }
    }
  }
`;

const ActiveBadge = styled(DefaultActiveBadge)`
  position: absolute;
  bottom: 5px;
  right: 5px;
`;

const PreferencesDropdown = styled(UserPreferencesDropdown)`
  pointer-events: auto;
  top: 40px;
  right: 10px;
`;
