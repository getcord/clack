import * as React from 'react';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { Colors } from './Colors';
import { thread } from '@cord-sdk/react/';
import { StyledComposer, StyledMessage } from './StyledCord';
import { MessageListItemStyled } from './MessageListItem';
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
  const { messages, loading, hasMore, fetchMore } =
    thread.useThreadData(threadID);

  // TEMPORARY HACK TO LOAD ALL MESSAGES
  if (!loading && hasMore) {
    void fetchMore(100);
  }

  return (
    <ThreadDetailsWrapper className={className}>
      <ThreadDetailsHeader>
        <span>Thread</span>
        <CloseButton onClick={onClose}>
          <StyledXMarkIcon />
        </CloseButton>
      </ThreadDetailsHeader>
      <MessageListWrapper>
        {messages.map((message) => (
          <MessageListItemStyled key={message.id}>
            <StyledMessage threadId={threadID} messageId={message.id} />
          </MessageListItemStyled>
        ))}
      </MessageListWrapper>
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
  borderLeft: `1px solid ${Colors.gray_light}`,
  overflowY: 'scroll',
});

const ThreadDetailsHeader = styled(PageHeader)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${Colors.gray_light}`,
  padding: '8px 8px 8px 16px',
});

const MessageListWrapper = styled.div({
  marginBottom: '12px',
});
