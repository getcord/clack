import * as React from 'react';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { Colors } from './Colors';
import { thread } from '@cord-sdk/react/';
import { StyledComposer, StyledMessage } from './StyledCord';
import { MessageList } from './MessageList';
import { XMarkIcon } from '@heroicons/react/20/solid';

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
        <CloseButton onClick={onClose}>
          <StyledXMarkIcon />
        </CloseButton>
      </ThreadDetailsHeader>
      <StyledMessageList>
        {messages.map((message) => (
          <StyledMessage
            key={message.id}
            threadId={threadID}
            messageId={message.id}
          />
        ))}
      </StyledMessageList>
      <StyledComposer threadId={threadID} showExpanded />
    </ThreadDetailsWrapper>
  );
}

const StyledXMarkIcon = styled(XMarkIcon)({
  width: '24px',
  height: '24px',
});

const CloseButton = styled.div({
  lineHeight: 0,
  padding: '8px',
  '&:hover': {
    backgroundColor: Colors.gray_highlight,
  },
});

const ThreadDetailsWrapper = styled.div({
  borderLeft: `1px solid ${Colors.light_gray}`,
});

const ThreadDetailsHeader = styled(PageHeader)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${Colors.light_gray}`,
  padding: '8px 8px 8px 16px',
});

const StyledMessageList = styled(MessageList)({
  marginBottom: '12px',
});
