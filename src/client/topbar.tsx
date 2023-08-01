import * as React from 'react';
import { Avatar as DefaultAvatar } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { StatusBadge } from 'src/client/StatusBadge';

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
      <StatusBadge userID={userID} />
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
