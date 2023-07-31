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

  const firstMessageTimestamp =
    threads[threads.length - 1]?.firstMessage?.createdTimestamp;

  const renderThreads = threads.map((thread, index) => {
    if (index < 1) {
      return (
        <MessageListItem
          key={thread.id}
          thread={thread}
          onOpenThread={onOpenThread}
        />
      );
    }
    const lastMessageTimestamp = threads[index - 1].firstMessage
      ?.createdTimestamp
      ? threads[index - 1].firstMessage?.createdTimestamp
      : null;

    const isDifferentDay =
      lastMessageTimestamp &&
      thread.firstMessage?.createdTimestamp.getDate() !==
        lastMessageTimestamp.getDate();

    return (
      <React.Fragment key={thread.id}>
        {lastMessageTimestamp && isDifferentDay ? (
          <DateDivider timestamp={lastMessageTimestamp} />
        ) : null}
        <MessageListItem thread={thread} onOpenThread={onOpenThread} />
      </React.Fragment>
    );
  });

  return (
    <Root ref={threadListRef}>
      {renderThreads}
      {/* This is rendered column-reverse so we need the pagination trigger to be at the bottom. */}
      <PaginationTrigger
        loading={loading}
        hasMore={hasMore}
        fetchMore={fetchMore}
      />
      {!hasMore && !loading ? (
        <>
          {firstMessageTimestamp && (
            <DateDivider timestamp={firstMessageTimestamp} />
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
