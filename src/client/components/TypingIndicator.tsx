import { thread } from '@cord-sdk/react';
import React from 'react';
import { styled } from 'styled-components';

export function TypingIndicator({ threadID }: { threadID: string }) {
  const [typingUsers, setTypingUsers] = React.useState<string[] | undefined>();
  const summary = thread.useThreadSummary(threadID);
  React.useEffect(() => {
    const getTyping = () => {
      // this is currently userID and not user name
      // it'd probably be easier to have access to the usernames
      // as now we'll have to make a request to get the username
      setTypingUsers(summary?.typing);
    };
    // Set up the interval to fetch data every 3000 milliseconds
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
