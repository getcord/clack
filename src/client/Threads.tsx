import React, { useCallback, useEffect, useRef } from 'react';
import { thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { MessageListItem } from 'src/client/MessageListItem';
import { PaginationTrigger } from './PaginationTrigger';
import { EmptyChannel } from './EmptyChannel';
import { DateDivider } from './DateDivider';

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
      {/* This is rendered column-reverse so we need the pagination trigger to be at the bottom. */}
      <PaginationTrigger
        loading={loading}
        hasMore={hasMore}
        fetchMore={fetchMore}
      />
      {!hasMore ? (
        <>
          {threads[0]?.firstMessage?.createdTimestamp && (
            <DateDivider
              timestamp={threads[0]?.firstMessage?.createdTimestamp}
            />
          )}
          <EmptyChannel channelID={channel} />
        </>
      ) : null}
    </Root>
  );
}

const Root = styled.div({
  overflowY: 'scroll',
  paddingBottom: '20px',
  display: 'flex',
  flexDirection: 'column-reverse',
});
