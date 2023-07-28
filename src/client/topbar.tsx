import * as React from 'react';
import { Avatar as DefaultAvatar, presence } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Colors } from './Colors';

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

  return (
    <Container className={className}>
      <Avatar userId={userID} enableTooltip />
      <ActiveBadge isActive={true} />
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

const Avatar = styled(DefaultAvatar)`
  .cord-avatar-container {
    width: 26px;
    height: 26px;
  }
`;

const ActiveBadge = styled.div<{ isActive: boolean }>(({ isActive }) => ({
  position: 'absolute',
  backgroundColor: 'inherit',
  padding: '3px',
  bottom: '5px',
  right: '5px',
  borderRadius: '99px',
  '&::after': {
    content: '""',
    display: 'block',
    borderRadius: '99px',
    height: '9px',
    width: '9px',
    backgroundColor: isActive ? Colors.green_active : 'inherit',
    boxShadow: isActive ? 'none' : 'inset 0 0 0 1.5px white',
  },
}));
