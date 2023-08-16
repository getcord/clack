import React, { useEffect, useRef, useState } from 'react';
import { thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { ArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ThreadSummary } from '@cord-sdk/types';
import { PaginationTrigger } from 'src/client/components/PaginationTrigger';
import { MessageListItem } from 'src/client/components/MessageListItem';
import { EmptyChannel } from 'src/client/components/EmptyChannel';
import { DateDivider } from 'src/client/components/DateDivider';
import { Colors } from 'src/client/consts/Colors';
import { MessageContext } from 'src/client/context/MessageContext';

type ThreadsProps = {
  channel: string;
  onOpenThread: (threadID: string) => void;
};

export function Threads({ channel, onOpenThread }: ThreadsProps) {
  const { threads, loading, hasMore, fetchMore } = thread.useLocationData(
    { channel },
    {
      sortDirection: 'descending',
    },
  );
  const [unseenMessages, setUnseenMessages] = useState<ThreadSummary[]>([]);

  useEffect(() => {
    if (!isAtBottom()) {
      setUnseenMessages(threads.filter((thread) => !thread.firstMessage?.seen));
    }
  }, [threads]);

  const threadListRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const isAtBottom = () => {
    if (!threadListRef.current) {
      return false;
    }
    return threadListRef.current.scrollTop >= 0;
  };

  const scrollToBottom = () => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView();
    }
  };

  const firstMessageTimestamp =
    threads[threads.length - 1]?.firstMessage?.createdTimestamp;
  const { editingMessage } = React.useContext(MessageContext);

  const renderThreads = threads.map((thread, index) => {
    if (index < 1) {
      return (
        <MessageListItem
          key={`${editingMessage} - ${thread.id}`}
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
      <React.Fragment key={`${editingMessage} - ${thread.id}`}>
        {lastMessageTimestamp && isDifferentDay ? (
          <DateDivider timestamp={lastMessageTimestamp} />
        ) : null}
        <MessageListItem thread={thread} onOpenThread={onOpenThread} />
      </React.Fragment>
    );
  });

  return (
    <Root>
      <div ref={anchorRef} />
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
      {unseenMessages.length && !isAtBottom() ? (
        <NewMessagePill
          count={unseenMessages.length}
          onClick={() => {
            scrollToBottom();
            setUnseenMessages([]);
          }}
          onClose={() => setUnseenMessages([])}
        />
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

function NewMessagePill({
  count,
  onClick,
  onClose,
}: {
  count: number;
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <Pill onClick={onClick}>
      <ArrowIcon />
      {count} new {count === 1 ? 'message' : 'messages'}
      <CloseButton
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <XIcon />
      </CloseButton>
    </Pill>
  );
}

const Pill = styled.div({
  position: 'absolute',
  top: '64px', // height of header (56px) + 8px
  left: '50%',
  translate: '-50% 0',
  zIndex: 5,

  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  borderRadius: '999px',
  backgroundColor: Colors.blue_active,
  color: 'white',
  padding: '8px 16px',
  cursor: 'pointer',
});

const ArrowIcon = styled(ArrowDownIcon)({
  height: '14px',
  width: '14px',
});

const CloseButton = styled.button({
  all: 'unset',
  paddingLeft: '8px',
  display: 'flex',
  alignItems: 'center',
});

const XIcon = styled(XMarkIcon)({
  width: '16px',
  height: '16px',
});
