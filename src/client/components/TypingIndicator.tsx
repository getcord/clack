import { thread, user } from '@cord-sdk/react';
import React from 'react';
import { styled } from 'styled-components';

export function TypingIndicator({ threadID }: { threadID: string }) {
  const [typingUsers, setTypingUsers] = React.useState<string[] | undefined>();
  const summary = thread.useThreadSummary(threadID);

  const getUserName = (u: string) => {
    const data = user.useUserData(u);
    return data?.name ?? '';
  };

  React.useEffect(() => {
    const getTyping = () => {
      const y = summary?.typing.map((id) => getUserName(id)) || [];
      console.log(y);
      setTypingUsers(y);
    };
    // Set up the interval to fetch data every 3 seconds
    const intervalId = setInterval(getTyping, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [summary]);

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
