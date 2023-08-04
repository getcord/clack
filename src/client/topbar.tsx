import * as React from 'react';
import { Avatar as DefaultAvatar, presence } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Modal } from 'src/client/Modal';
import { useUserStatus } from 'src/client/hooks/useUserStatus';
import { ActiveBadge as DefaultActiveBadge } from 'src/client/ActiveBadge';
import { SetToActiveModal } from 'src/client/SetToActiveModal';
import { UserPreferencesDropdown } from 'src/client/UserPreferenceDropdown';

export const Topbar = ({
  userID,
  className,
}: {
  userID?: string;
  className?: string;
}) => {
  const [status, setStatus] = useUserStatus();
  const present = presence.useLocationData(
    { page: 'clack' },
    { exclude_durable: false, partial_match: true },
  );

  const [showDropdown, setShowDropdown] = React.useState(false);
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
    setStatus('away');
    void window.CordSDK?.presence.setPresent(
      { page: 'clack' },
      { absent: true },
    );
  };

  const onSetToActive: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setShouldShowActiveModal(false);
    setStatus('active');
    void window.CordSDK?.presence.setPresent({ page: 'clack' });
  };

  const onAvatarClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
    setShouldShowActiveModal(false);
  };

  return (
    <Container className={className}>
      <AvatarWrapper onClick={onAvatarClick}>
        {userID && <Avatar userId={userID} enableTooltip />}
      </AvatarWrapper>
      <ActiveBadge className={className} $isActive={status === 'active'} />
      <Modal isOpen={showDropdown} onClose={() => setShowDropdown(false)}>
        <PreferencesDropdown
          status={status}
          setStatus={setStatus}
          onClose={() => setShowDropdown(false)}
        />
      </Modal>
      {isPresent &&
      status !== 'active' &&
      shouldShowActiveModal &&
      !activeModalPreference ? (
        <SetToActiveModal
          onClose={onCancel}
          onCancel={onCancel}
          onSetToActive={onSetToActive}
        />
      ) : null}
    </Container>
  );
};

const Container = styled.div({
  position: 'relative',
  color: '#f00',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingInlineEnd: '12px',
});

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
