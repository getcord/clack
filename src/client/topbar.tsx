import * as React from 'react';
import { Avatar as DefaultAvatar } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { useCordToken } from 'src/hooks/useCordToken';

export const Topbar = ({ className }: { className?: string }) => {
  const [_, userID] = useCordToken();

  return (
    <Container className={className}>
      <Avatar userId={userID!} />
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
