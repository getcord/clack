import { thread, user } from '@cord-sdk/react';
import React from 'react';
import { keyframes, styled } from 'styled-components';

export function TypingIndicator({
  threadID,
  // TODO: passing in the organizationId as a prop like this is incredibly ugly.
  // This is a Cord issue, not a Clack issue -- we need to support passing
  // `null` for the org ID, since Cord should be able to "figure it out" from
  // the thread ID. We don't support that yet, but it's planned.
  organizationId,
}: {
  threadID: string;
  organizationId: string | undefined;
}) {
  const summary = thread.useThreadSummary(threadID, { organizationId });
  const typingUsers = summary?.typing ?? [];

  return (
    <>
      {typingUsers.length > 0 && (
        <Wrapper>
          {typingUsers.map((user, index) => (
            <TypingUserText
              key={user}
              userID={user}
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
  userID,
  total,
  index,
}: {
  userID: string;
  total: number;
  index: number;
}) {
  const data = user.useUserData(userID);

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

const animateDots = keyframes`
50% {
  content: '..';
}
100% {
  content: '...';
}
`;

const Wrapper = styled.div`
  font-size: 12px;
  margin: 5px 4px 20px 20px;
  &:after {
    animation: ${animateDots} 1s linear infinite;
    content: '.';
  }
`;
