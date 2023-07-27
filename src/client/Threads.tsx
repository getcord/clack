import React, { useCallback, useEffect, useRef } from 'react';
import { thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { MessageListItem } from 'src/client/MessageListItem';

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
        <MessageListItem
          key={thread.id}
          thread={thread}
          onOpenThread={onOpenThread}
        />
      ))}
    </Root>
  );
}

const Root = styled.div({
  overflow: 'scroll',
  paddingBottom: '20px',
  display: 'flex',
  flexDirection: 'column-reverse',
});
