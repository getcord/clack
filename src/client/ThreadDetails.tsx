import * as React from 'react';
import { styled } from 'styled-components';
import { thread } from '@cord-sdk/react/';
import { XMarkIcon } from '@heroicons/react/20/solid';
import type { CoreMessageData, ThreadSummary } from '@cord-sdk/types';
import { PageHeader } from 'src/client/PageHeader';
import { Colors } from 'src/client/Colors';
import { StyledComposer, StyledMessage } from 'src/client/StyledCord';
import { MessageListItemStyled } from 'src/client/MessageListItem';
import { PaginationTrigger } from 'src/client/PaginationTrigger';
import { TypingIndicator } from 'src/client/TypingIndicator';

import { Options } from 'src/client/Options';

interface MessageProps {
  message: CoreMessageData;
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
        <Options thread={thread} hovered={hovered} message={message} />
      </div>
    </MessageListItemStyled>
  );
}

export type ThreadDetailsProps = {
  className?: string;
  threadID: string;
  onClose: () => void;
  channelID: string;
};

export function ThreadDetails({
  className,
  threadID,
  onClose,
  channelID,
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
        <span style={{ gridArea: 'thread' }}>Thread</span>
        <ChannelName># {channelID}</ChannelName>
        <CloseButton onClick={onClose}>
          <StyledXMarkIcon />
        </CloseButton>
      </ThreadDetailsHeader>
      <ScrollableContainer>
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
            <Message
              key={message.id}
              message={message}
              thread={threadSummary}
            />
          ))}
        </MessageListWrapper>
        <StyledComposer autofocus threadId={threadID} showExpanded />
        <TypingIndicator threadID={threadID} />
      </ScrollableContainer>
    </ThreadDetailsWrapper>
  );
}

const ThreadDetailsWrapper = styled.div({
  borderLeft: `1px solid ${Colors.gray_light}`,
  overflow: 'hidden',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
});

const ScrollableContainer = styled.div({
  overflow: 'auto',
  flex: 1,
});

const ChannelName = styled.span({
  gridArea: 'channel-name',
  fontSize: '13px',
  fontWeight: 400,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  color: Colors.gray_dark,
});

const StyledXMarkIcon = styled(XMarkIcon)({
  width: '24px',
  height: '24px',
});

const CloseButton = styled.div({
  gridArea: 'close-button',
  lineHeight: 0,
  padding: '8px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: Colors.gray_highlight,
  },
});

const ThreadDetailsHeader = styled(PageHeader)({
  backgroundColor: 'inherit',
  display: 'grid',
  gridGap: '12px',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateAreas: `
  "thread channel-name close-button"`,
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
