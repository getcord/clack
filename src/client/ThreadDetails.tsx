import * as React from 'react';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { Colors } from './Colors';
import { thread } from '@cord-sdk/react/';
import { StyledComposer, StyledMessage } from './StyledCord';

export type ThreadDetailsProps = {
  className?: string;
  threadID: string;
  onClose: () => void;
};

export function ThreadDetails({
  className,
  threadID,
  onClose,
}: ThreadDetailsProps) {
  const { messages } = thread.useThreadData(threadID);

  return (
    <ThreadDetailsWrapper className={className}>
      <ThreadDetailsHeader>
        <span>Thread</span>
        <span onClick={onClose}>X</span>
      </ThreadDetailsHeader>
      <div>
        {messages.map((message) => (
          <StyledMessage
            key={message.id}
            threadId={threadID}
            messageId={message.id}
          />
        ))}
      </div>
      <StyledComposer threadId={threadID} />
    </ThreadDetailsWrapper>
  );
}

const ThreadDetailsWrapper = styled.div({
  borderLeft: `1px solid ${Colors.light_gray}`,
});

const ThreadDetailsHeader = styled(PageHeader)({
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${Colors.light_gray}`,
});
