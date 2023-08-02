import * as React from 'react';
import { Avatar as DefaultAvatar, presence } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { UserPreferencesDropdown } from 'src/client/UserPreferenceDropdown';
import { useUserStatus } from './hooks/useUserStatus';
import { ActiveBadge as DefaultActiveBadge } from './ActiveBadge';
import { SetToActiveModal } from './SetToActiveModal';

export const Topbar = ({
  userID,
  className,
}: {
  userID?: string;
  className?: string;
}) => {
  if (!userID) {
    return null;
  }
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
  };

  const onSetToActive: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setStatus('active');
    setShouldShowActiveModal(false);
  };

  const onAvatarClick = () => {
    setShowDropdown((prev) => !prev);
    setShouldShowActiveModal(false);
  };

  return (
    <Container className={className} onClick={onAvatarClick}>
      <Avatar userId={userID} enableTooltip />
      <ActiveBadge className={className} $isActive={status === 'active'} />
      {showDropdown && (
        <UserPreferencesDropdown
          status={status}
          setStatus={setStatus}
          onClose={() => setShowDropdown(false)}
        />
      )}
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
  cursor: 'pointer',
});

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
