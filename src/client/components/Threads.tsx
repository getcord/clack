import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { betaV2, experimental, thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { ArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Channel } from 'src/client/consts/Channel';
import { PaginationTrigger } from 'src/client/components/PaginationTrigger';
import { MessageListItem } from 'src/client/components/MessageListItem';
import { EmptyChannel } from 'src/client/components/EmptyChannel';
import { DateDivider } from 'src/client/components/DateDivider';
import { Colors } from 'src/client/consts/Colors';
import { MessageContext } from 'src/client/context/MessageContext';
import { CordVersionContext } from 'src/client/context/CordVersionContext';
import { ClackSendButton } from 'src/client/components/ClackSendButton';
import { Message } from 'src/client/components/ClackMessage';
import {
  extractUsersFromDirectMessageChannel,
  isDirectMessageChannel,
} from 'src/common/consts';

type ThreadsProps = {
  channel: Channel;
  onOpenThread: (threadID: string) => void;
  onScrollUp: () => void;
  onScrollToBottom: () => void;
};

export function Threads(props: ThreadsProps) {
  const cordVersionContext = useContext(CordVersionContext);

  if (cordVersionContext.version === '3.0') {
    return <Threads3 {...props} />;
  }
  return <Threads4 {...props} />;
}

function Threads3({
  channel,
  onOpenThread,
  onScrollToBottom,
  onScrollUp,
}: ThreadsProps) {
  const { threads, counts, loading, hasMore, fetchMore } = thread.useThreads({
    filter: { location: { channel: channel.id } },
    sortDirection: 'descending',
  });
  const threadListRef = useRef<HTMLDivElement>(null);

  const isAtBottomOfThreads = useCallback(() => {
    if (!threadListRef.current) {
      return false;
    }
    return threadListRef.current.scrollTop >= 0;
  }, []);

  useEffect(() => {
    if (isAtBottomOfThreads()) {
      onScrollToBottom();
    }
  }, [isAtBottomOfThreads, threads, onScrollToBottom]);

  const scrollHandler = useCallback(() => {
    if (!isAtBottomOfThreads()) {
      onScrollUp();
    } else {
      // little delay for a nice UX ✨
      setTimeout(() => isAtBottomOfThreads() && onScrollToBottom(), 100);
    }
  }, [isAtBottomOfThreads, onScrollToBottom, onScrollUp]);

  useEffect(() => {
    const el = threadListRef.current;
    if (!el) {
      return;
    }
    el.addEventListener('scroll', scrollHandler);
    return () => el.removeEventListener('scroll', scrollHandler);
  }, [scrollHandler, threadListRef]);

  const markAsRead = useCallback(() => {
    void window.CordSDK!.thread.setSeen(
      {
        location: {
          value: { channel: channel.id },
          partialMatch: false,
        },
      },
      true,
    );
  }, [channel]);

  const scrollToBottom = () => {
    if (threadListRef.current) {
      threadListRef.current.scrollTop = 0;
    }
  };

  const firstMessageTimestamp =
    threads[threads.length - 1]?.firstMessage?.createdTimestamp;
  const { editingMessage } = React.useContext(MessageContext);

  const renderThreads = threads.map((thread, index) => {
    if (index < 1) {
      return (
        <MessageListItem
          key={`${editingMessage?.page}-${editingMessage?.messageId}-${thread.id}`}
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
      <React.Fragment
        key={`${editingMessage?.page}-${editingMessage?.messageId}-${thread.id}`}
      >
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
          <EmptyChannel channel={channel} />
        </>
      ) : null}
      {counts && counts.new > 0 && !isAtBottomOfThreads() ? (
        <NewMessagePill
          count={counts.new}
          onClick={() => {
            scrollToBottom();
          }}
          onClose={() => markAsRead()}
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

const REPLACE = {
  SendButton: ClackSendButton,
  Message: Message,
  ScrollContainer: ThreadsScrollContainer,
};

function Threads4({ channel, onOpenThread }: ThreadsProps) {
  const threadsData = thread.useThreads({
    filter: { location: { channel: channel.id } },
    sortDirection: 'descending',
  });

  const threadsDataReversed = useMemo(() => {
    return {
      ...threadsData,
      threads: [...threadsData.threads].reverse(),
    };
  }, [threadsData]);

  const composerOptions: experimental.ThreadsProps['composerOptions'] =
    useMemo(() => {
      return {
        position: 'bottom',
        groupID: channel.org,
        location: { channel: channel.id },
        name: channel.threadName,
        url: window.location.href,
        ...(isDirectMessageChannel(channel.id) && {
          addSubscribers: extractUsersFromDirectMessageChannel(channel.id),
        }),
      };
    }, [channel.id, channel.org, channel.threadName]);

  return (
    <OpenThreadContext.Provider value={{ onOpenThread }}>
      <StyledExperimentalThreads
        threadsData={threadsDataReversed}
        composerOptions={composerOptions}
        replace={REPLACE}
      />
    </OpenThreadContext.Provider>
  );
}

const StyledExperimentalThreads = styled(experimental.Threads)({
  '&&': { overflowY: 'auto', border: 'none', padding: 0 },
  '& .cord-inline-reply-button': { display: 'none' },
  '& .cord-composer': { margin: '0 20px 20px 20px' },
});

export const OpenThreadContext = createContext<{
  onOpenThread: (threadID: string) => void;
}>({
  onOpenThread: () => {},
});

function ThreadsScrollContainer(props: betaV2.ScrollContainerProps) {
  return (
    <betaV2.ScrollContainer
      {...props}
      autoScrollToNewest="auto"
      autoScrollDirection="bottom"
    />
  );
}
