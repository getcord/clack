import React from 'react';
import { Message, thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Colors } from './Colors';

interface MessagesProps {
  channel: string;
}

export function Messages({ channel }: MessagesProps) {
  const { threads } = thread.useLocationData(
    { channel },
    {
      sortDirection: 'ascending',
    },
  );

  return (
    <Wrapper>
      {threads.map((thread) => (
        <MessageWrapper key={thread.id}>
          <StyledMessage
            threadId={thread.id}
            messageId={thread.firstMessage?.id}
            onClick={(data) => console.log(data)}
          />
        </MessageWrapper>
      ))}
    </Wrapper>
  );
}

const StyledMessage = styled(Message)`
  .cord-message {
    align-items: flex-start;
    background-color: inherit;
    grid-template-columns: auto auto auto auto 1fr auto;
  }
  .cord-thread {
    border: none;
  }
  .cord-thread-container {
    height: auto;
  }
  .cord-collapsed-thread {
    border: none;
  }
  .cord-avatar-container {
    height: 36px;
    width: 36px;
  }
`;

const Wrapper = styled.div({
  // 'cord-thread': {
  //   border: 'none',
  // },
  // '.cord-thread-container': {
  //   height: 'auto',
  // },
  // '.cord-collapsed-thread': {
  //   border: 'none',
  // },
  // '.cord-avatar-container': {
  //   height: '36px',
  //   width: '36px',
  // },
});

const MessageWrapper = styled.div({
  padding: '8px 20px',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: Colors.lightGray,
  },
});
