import React, { useCallback, useEffect, useRef } from 'react';
import { Facepile, thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Colors } from './Colors';
import type { ThreadSummary } from '@cord-sdk/types';
import { StyledMessage } from './StyledCord';
import { MessageListItem } from './MessageListItem';

type ThreadsProps = {
  channel: string;
  onOpenThread: (threadID: string) => void;
  onScrollUp: () => void;
  onScrollToBottom: () => void;
};

export function Threads({
  channel,
  onOpenThread,
  onScrollUp,
  onScrollToBottom,
}: ThreadsProps) {
  const { threads, loading, hasMore, fetchMore } = thread.useLocationData(
    { channel },
    {
      sortDirection: 'descending',
    },
  );

  // TEMPORARY HACK TO LOAD ALL THREADS
  if (!loading && hasMore) {
    void fetchMore(100);
  }
  const threadListRef = useRef<HTMLDivElement>(null);

  const isAtBottom = () => {
    if (!threadListRef.current) {
      return false;
    }
    return threadListRef.current.scrollTop >= 0;
  };

  const scrollUpHandler = useCallback(() => {
    if (!isAtBottom()) {
      onScrollUp();
      return;
    }
    if (isAtBottom()) {
      setTimeout(() => isAtBottom() && onScrollToBottom(), 100);
    }
  }, [onScrollUp, onScrollToBottom]);

  useEffect(() => {
    const el = threadListRef.current;
    if (!el) {
      return;
    }
    el.addEventListener('scroll', scrollUpHandler);
    return () => el.removeEventListener('scroll', scrollUpHandler);
  }, [scrollUpHandler]);

  return (
    <Root ref={threadListRef}>
      {threads.map((thread) => (
        <MessageListItem key={thread.id}>
          <StyledMessage
            key={thread.id}
            threadId={thread.id}
            messageId={thread.firstMessage?.id}
          />
          <ThreadReplies summary={thread} onOpenThread={onOpenThread} />
        </MessageListItem>
      ))}
    </Root>
  );
}

type ThreadRepliesProps = {
  summary: ThreadSummary;
  onOpenThread: (threadID: string) => void;
};

function ThreadReplies({ summary, onOpenThread }: ThreadRepliesProps) {
  const numReplies = summary.total - 1;
  if (numReplies < 1) {
    return null;
  }

  const replyWord = numReplies === 1 ? 'reply' : 'replies';
  return (
    <RepliesWrapper onClick={(_e) => onOpenThread(summary.id)}>
      <Facepile users={summary.repliers} />{' '}
      <RepliesCount>
        {summary.total - 1} {replyWord}
      </RepliesCount>
      <RepliesTimestamp>Last reply 999 days ago</RepliesTimestamp>
    </RepliesWrapper>
  );
}

const Root = styled.div({
  overflow: 'scroll',
  paddingBottom: '20px',
  display: 'flex',
  flexDirection: 'column-reverse',
});

const RepliesWrapper = styled.div({
  cursor: 'pointer',
  display: 'flex',
  borderRadius: '6px',
  gap: '8px',
  marginLeft: '36px',
  marginTop: '4px',
  paddingLeft: '8px',
  paddingTop: '8px',
  padding: '4px 8px',
  '&:hover': {
    backgroundColor: 'white',
  },
  '.cord-facepile': {
    display: 'inline-flex',
    gap: '4px',
  },
  '.cord-avatar-container': {
    cursor: 'pointer',
    height: '24px',
    width: '24px',
    marginLeft: 0,
    boxShadow: 'none',
  },
});

const RepliesCount = styled.span({
  alignSelf: 'center',
  color: Colors.blue_active,
});

const RepliesTimestamp = styled.span({
  alignSelf: 'center',
  color: Colors.gray_dark,
});
