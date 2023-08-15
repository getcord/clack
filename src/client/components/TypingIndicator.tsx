import { thread, user } from '@cord-sdk/react';
import React, { useEffect } from 'react';
import { styled } from 'styled-components';

export function TypingIndicator({ threadID }: { threadID: string }) {
  const [typingUsers, setTypingUsers] = React.useState<string[] | undefined>();
  const summary = thread.useThreadSummary(threadID);
  useEffect(() => {
    setTypingUsers(summary?.typing);
  }, [summary?.typing]);

  return (
    <>
      {typingUsers && typingUsers.length > 0 && (
        <Wrapper>
          {typingUsers.map((user, index) => (
            <TypingUserText
              key={user}
              typing={user}
              total={typingUsers.length}
              index={index}
            />
          ))}
          <Text>{typingUsers.length == 1 ? ' is' : ' are'} typing</Text>
        </Wrapper>
      )}
    </>
  );
}

export function TypingUserText({
  typing,
  total,
  index,
}: {
  typing: string;
  total: number;
  index: number;
}) {
  const data = user.useUserData(typing);

  return (
    <>
      {data && (
        <TextName>
          {data?.name}
          {total <= 1 || index === total - 1
            ? ' '
            : index < total - 2
            ? ', '
            : ' and '}
        </TextName>
      )}
    </>
  );
}

const Text = styled.span`
  color: #616061;
`;

const TextName = styled(Text)`
  font-weight: 700;
`;

const Wrapper = styled.div`
  font-size: 12px;
  margin: 5px 4px 20px 20px;
`;
