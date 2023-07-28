import { thread } from '@cord-sdk/react';
import React from 'react';
import { styled } from 'styled-components';

export function TypingIndicator({ threadID }: { threadID: string }) {
  const [typingUsers, setTypingUsers] = React.useState<string[] | undefined>();
  const typing = thread.useThreadSummary(threadID)?.typing;
  React.useEffect(() => {
    const getTyping = () => {
      setTypingUsers(typing);
    };
    const intervalId = setInterval(getTyping, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [typing]);

  return (
    <>
      {typingUsers && typingUsers.length > 0 && (
        <Text>
          {typingUsers.join(', ')}
          {typingUsers.length == 1 ? ' is' : ' are'} typing
        </Text>
      )}
    </>
  );
}

const Text = styled.span`
  display: block;
  fontsize: 12px;
  color: #616061;
  margin: 5px 4px;
  margin-left: 16px;
`;
