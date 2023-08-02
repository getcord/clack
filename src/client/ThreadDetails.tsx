import * as React from 'react';
import { styled } from 'styled-components';
import { thread } from '@cord-sdk/react/';
import { XMarkIcon } from '@heroicons/react/20/solid';
import type { MessageData, ThreadSummary } from '@cord-sdk/types';
import { PageHeader } from 'src/client/PageHeader';
import { Colors } from 'src/client/Colors';
import { StyledComposer, StyledMessage } from 'src/client/StyledCord';
import { MessageListItemStyled } from 'src/client/MessageListItem';
import { PaginationTrigger } from 'src/client/PaginationTrigger';
import { TypingIndicator } from 'src/client/TypingIndicator';

import { Options } from 'src/client/Options';

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

  const [sectionWidth, setSectionWidth] = React.useState(0);
  const resizeRef = React.useRef<HTMLDivElement>(null);

  const onResize = React.useCallback(() => {
    if (!resizeRef.current) {
      return;
    }
    setSectionWidth(resizeRef.current.getBoundingClientRect().width);
  }, [])

  React.useLayoutEffect(() => {
    onResize();
  }, [resizeRef.current?.getBoundingClientRect().width])


  React.useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!threadSummary || messages.length === 0) {
    return <div>Loading messages...</div>;
  }

  const numReplies = threadSummary.total - 1;
  const replyWord = numReplies === 1 ? 'reply' : 'replies';

  return (
    <ThreadDetailsWrapper ref={resizeRef} className={className}>
      <ThreadDetailsHeader>
        <span style={{ gridArea: 'thread' }}>Thread</span>
        <ChannelName># {channelID}</ChannelName>
        <CloseButton onClick={onClose}>
          <StyledXMarkIcon />
        </CloseButton>
      </ThreadDetailsHeader>
        <AllowOverflowXBox>
      <MessageListWrapper $width={sectionWidth}>
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
      <SizedComposer $width={sectionWidth} autofocus threadId={threadID} showExpanded />
      <TypingIndicator threadID={threadID} />
        </AllowOverflowXBox>
    </ThreadDetailsWrapper>
  );
}

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

const ThreadDetailsWrapper = styled.div({
  borderLeft: `1px solid ${Colors.gray_light}`,
  position: 'relative',
  backgroundColor: 'white',
});

const ThreadDetailsHeader = styled(PageHeader)({
  position: 'sticky',
  top: 0,
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

// this is required to allow overflow-y to be scroll, while overflow-x visible 🙄
const AllowOverflowXBox = styled.div({
  position: "absolute",
  width: '800px', 
  top: '64px', 
  right: 0, 
  bottom: 0,
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'end',
  overflow: 'scroll'
})

const MessageListWrapper = styled.div<{ $width: number }>(({$width}) => ({
  marginBottom: '12px',
  width: `${$width}px`,
}));

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

// -40 for the width comes from the 20px right and left on composer padding.
const SizedComposer = styled(StyledComposer)<{ $width: number }>`
  width: ${({ $width }) => $width - 40}px
`