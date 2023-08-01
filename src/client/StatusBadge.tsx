import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { presence } from '@cord-sdk/react';
import { Colors } from './Colors';
import { SetToActiveModal } from './SetToActiveModal';
import { useUserStatus } from './hooks/useUserStatus';

interface StatusBadgeProps {
  userID: string;
}

export function StatusBadge({ userID }: StatusBadgeProps) {
  const present = presence.useLocationData(
    { page: 'clack' },
    { exclude_durable: false, partial_match: true },
  );
  const [shouldShowActiveModal, setShouldShowActiveModal] = useState(true);
  const [status, setStatus] = useUserStatus();

  const activeModalPreference =
    window.localStorage.getItem('dont-ask-again') === 'true' ? true : false;

  const isPresent = useMemo(
    () => !!present?.find((user) => user.id === userID),
    [present, userID],
  );

  const onBadgeClick = () => {
    setShouldShowActiveModal(false);
    setStatus(status === 'active' ? 'away' : 'active');
  };

  const onCancel = () => {
    setShouldShowActiveModal(false);
    setStatus('away');
  };

  const onSetToActive = () => {
    setStatus('active');
    setShouldShowActiveModal(false);
  };

  return (
    <>
      <ActiveBadge onClick={onBadgeClick} $isActive={status === 'active'} />
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
    </>
  );
}

export const ActiveBadge = styled.div<{ $isActive: boolean }>(
  ({ $isActive }) => ({
    position: 'absolute',
    backgroundColor: 'inherit',
    padding: '3px',
    bottom: '5px',
    right: '5px',
    borderRadius: '99px',
    '&::after': {
      cursor: 'pointer',
      content: '""',
      display: 'block',
      borderRadius: '99px',
      height: '9px',
      width: '9px',
      backgroundColor: $isActive ? Colors.green_active : 'inherit',
      boxShadow: $isActive ? 'none' : 'inset 0 0 0 1.5px white',
    },
  }),
);
