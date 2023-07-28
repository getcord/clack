import * as React from 'react';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { Colors } from './Colors';
import { thread } from '@cord-sdk/react/';
import { StyledComposer, StyledMessage } from './StyledCord';
import { MessageListItemStyled } from './MessageListItem';
import { XMarkIcon } from '@heroicons/react/20/solid';
import type { MessageData } from '@cord-sdk/types';
import { Options } from 'src/Options';
import type { ThreadSummary } from '@cord-sdk/types';

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

  // TEMPORARY HACK TO LOAD ALL MESSAGES
  if (!loading && hasMore) {
    void fetchMore(100);
  }
  if (!threadSummary || messages.length === 0) {
    return <div>Loading messages...</div>;
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
        <Message
          key={messages[0].id}
          message={messages[0]}
          thread={threadSummary}
        />
        <p>{messages.length - 1} replies</p>
        {messages.slice(1).map((message) => (
          <Message key={message.id} message={message} thread={threadSummary} />
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
