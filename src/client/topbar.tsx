import * as React from 'react';
import { Avatar as DefaultAvatar } from '@cord-sdk/react';
import { styled } from 'styled-components';

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
      <Avatar userId={userID} />
    </Container>
  );
};

const Container = styled.div({
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
