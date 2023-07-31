import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { presence } from '@cord-sdk/react';
import { Colors } from './Colors';

interface StatusBadgeProps {
  userID: string;
}

const localStorageKey = 'status';

type Status = 'active' | 'away';

export function StatusBadge({ userID }: StatusBadgeProps) {
  const present = presence.useLocationData(
    { page: 'clack' },
    { exclude_durable: false, partial_match: true },
  );
  const [shouldAlert, setShouldAlert] = useState(true);
  const [isActive, setIsActive] = useState(() =>
    window.localStorage.getItem(localStorageKey) === 'active' ? true : false,
  );

  const isPresent = useMemo(
    () => !!present?.find((user) => user.id === userID),
    [present, userID],
  );

  const updateStatusTo = useCallback(
    (status: Status) => {
      if (status === 'active') {
        setIsActive(true);
        window.CordSDK?.presence.setPresent(
          {
            page: 'clack',
          },
          {
            absent: isActive,
          },
        );
      } else if (status === 'away') {
        setIsActive(false);
        window.CordSDK?.presence.setPresent(
          {
            page: 'clack',
          },
          {
            absent: true,
          },
        );
      }
      window.localStorage.setItem(localStorageKey, status);
    },
    [isActive],
  );

  useEffect(() => {
    if (isPresent && !isActive && shouldAlert) {
      const shouldChangeStatus = confirm(
        'You are set to away, would you like to switch to appear active?',
      );
      if (shouldChangeStatus) {
        updateStatusTo('active');
      } else {
        updateStatusTo('away');
      }
      setShouldAlert(false);
    }
  }, [isPresent, updateStatusTo, isActive, shouldAlert]);

  const onClick = () => {
    setShouldAlert(false);
    updateStatusTo(isActive ? 'away' : 'active');
  };

  return <ActiveBadge onClick={onClick} $isActive={isActive} />;
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
