import * as React from 'react';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { Colors } from './Colors';
import { thread } from '@cord-sdk/react/';
import { StyledComposer, StyledMessage } from './StyledCord';
import { MessageListItemStyled } from './MessageListItem';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { TypingIndicator } from 'src/client/components/TypingIndicator';

import type { MessageData } from '@cord-sdk/types';
import { Options } from 'src/Options';
import type { ThreadSummary } from '@cord-sdk/types';
import { PaginationTrigger } from './PaginationTrigger';

interface MessageProps {
  message: MessageData;
  thread: ThreadSummary;
}

function Message({ message, thread }: MessageProps) {
  const [hovered, setHovered] = React.useState(false);

  const onMouseEnter = React.useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = React.useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <MessageListItemStyled key={message.id}>
      <div>
        <StyledMessage
          threadId={thread.id}
          messageId={message.id}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        <Options thread={thread} hovered={hovered} messageID={message.id} />
      </div>
    </MessageListItemStyled>
  );
}

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

  const threadSummary = thread.useThreadSummary(threadID);

  if (!threadSummary || messages.length === 0) {
    return <div>Loading messages...</div>;
  }

  const numReplies = threadSummary.total - 1;
  const replyWord = numReplies === 1 ? 'reply' : 'replies';

  return (
    <ThreadDetailsWrapper className={className}>
      <ThreadDetailsHeader>
        <span>Thread</span>
        <CloseButton onClick={onClose}>
          <StyledXMarkIcon />
        </CloseButton>
      </ThreadDetailsHeader>
      <MessageListWrapper>
        <Message
          key={threadSummary.firstMessage!.id}
          message={threadSummary.firstMessage!}
          thread={threadSummary}
        />
        <SeparatorWrap>
          {numReplies > 0 ? (
            <>
              <SeparatorText>
                {numReplies} {replyWord}
              </SeparatorText>
              <SeparatorLine />
            </>
          ) : null}
        </SeparatorWrap>
        <PaginationTrigger
          loading={loading}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
        {messages.slice(1).map((message) => (
          <Message key={message.id} message={message} thread={threadSummary} />
        ))}
      </MessageListWrapper>
      <StyledComposer threadId={threadID} showExpanded />
      <TypingIndicator threadID={threadID} />
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

const SeparatorWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 20px',
});

const SeparatorText = styled.span({
  fontSize: '13px',
  color: Colors.gray_dark,
});

const SeparatorLine = styled.hr({
  flex: 1,
  border: 'none',
  borderTop: `1px solid ${Colors.gray_light}`,
});
