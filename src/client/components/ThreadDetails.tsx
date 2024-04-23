import * as React from 'react';
import { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { experimental, thread as ThreadSdk } from '@cord-sdk/react/';
import { XMarkIcon } from '@heroicons/react/20/solid';
import type {
  ClientThreadData,
  CoreMessageData,
  ThreadSummary,
} from '@cord-sdk/types';

import type { ReplaceConfig } from '@cord-sdk/react/dist/mjs/types/experimental/components/replacements';
import { useTranslation } from 'react-i18next';

import { CordVersionContext } from 'src/client/context/CordVersionContext';
import type { Channel } from 'src/client/context/ChannelsContext';
import { ClackSendButton } from 'src/client/components/ClackSendButton';
import { PageHeader } from 'src/client/components/PageHeader';
import { Colors } from 'src/client/consts/Colors';
import {
  StyledComposer,
  StyledMessage,
} from 'src/client/components/style/StyledCord';
import { MessageListItemStyled } from 'src/client/components/MessageListItem';
import { PaginationTrigger } from 'src/client/components/PaginationTrigger';
import { TypingIndicator } from 'src/client/components/TypingIndicator';

import { Options } from 'src/client/components/Options';
import { MessageContext } from 'src/client/context/MessageContext';
import { ClackMessage } from 'src/client/components/ClackMessage';

const EMPTY_FUNCTION = () => {};

interface MessageProps {
  message: CoreMessageData;
  thread: ThreadSummary;
}

function Message({ message, thread }: MessageProps) {
  const [hovered, setHovered] = React.useState(false);
  const { editingMessage, setEditingMessage } =
    React.useContext(MessageContext);
  const isMessageBeingEdited =
    editingMessage &&
    editingMessage.page == 'threadDetails' &&
    editingMessage.messageId === message.id;

  const onMouseEnter = React.useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = React.useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <MessageListItemStyled
      key={`${editingMessage?.page}-${editingMessage?.messageId}-${message.id}`}
    >
      <div>
        <StyledMessage
          threadId={thread.id}
          messageId={message.id}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          isEditing={isMessageBeingEdited}
          onEditEnd={() => setEditingMessage(undefined)}
        />
        {!isMessageBeingEdited && (
          <Options
            thread={thread}
            hovered={hovered}
            message={message}
            page={'threadDetails'}
          />
        )}
      </div>
    </MessageListItemStyled>
  );
}

export type ThreadDetailsProps = {
  className?: string;
  threadID: string;
  onClose: () => void;
  channel: Channel;
};
function ClackThread(props: { threadID: string }) {
  const cordVersionContext = useContext(CordVersionContext);
  if (cordVersionContext.version === '3.0') {
    return <ClackThreadV3 {...props} />;
  }
  return <ClackThreadV4 {...props} />;
}

const INITIAL_CLACK_CONTEXT_VALUE = {};
const ClackThreadContext = React.createContext<{
  numReplies?: number;
  firstMessageID?: string;
  loading?: boolean;
  fetchMore?: (numToLoad: number) => Promise<void>;
  hasMore?: boolean;
  thread?: ClientThreadData;
}>(INITIAL_CLACK_CONTEXT_VALUE);

function MessageWithPaginationTrigger(props: experimental.MessageProps) {
  const { t } = useTranslation();
  const {
    numReplies = 0,
    firstMessageID,
    loading,
    fetchMore,
    hasMore,
  } = useContext(ClackThreadContext);
  if (
    props.message.id !== firstMessageID ||
    loading === undefined ||
    fetchMore === undefined ||
    hasMore === undefined
  ) {
    return (
      <ClackMessage
        message={props.message}
        onOpenThread={EMPTY_FUNCTION}
        inThreadDetails
      />
    );
  }
  return (
    <>
      <ClackMessage
        message={props.message}
        onOpenThread={EMPTY_FUNCTION}
        inThreadDetails
      />
      <SeparatorWrap>
        {numReplies > 0 ? (
          <>
            <SeparatorText>{t('replies', { count: numReplies })}</SeparatorText>
            <SeparatorLine />
          </>
        ) : null}
      </SeparatorWrap>
      <PaginationTrigger
        loading={loading}
        hasMore={hasMore}
        fetchMore={fetchMore}
      />
    </>
  );
}

const REPLACE = {
  Message: MessageWithPaginationTrigger,
  SendButton: ClackSendButton,
} satisfies ReplaceConfig;

function ClackThreadV4({ threadID }: { threadID: string }) {
  const thread = ThreadSdk.useThread(threadID);

  const firstMessageID = thread?.messages?.[0]?.id;
  const contextValue = useMemo(
    () => ({
      thread,
      numReplies: (thread?.thread?.total ?? 1) - 1,
      firstMessageID,
      loading: thread?.loading,
      fetchMore: thread?.fetchMore,
      hasMore: thread?.hasMore,
    }),
    [thread, firstMessageID],
  );
  return (
    <ClackThreadContext.Provider value={contextValue}>
      {/* Once the cord Thread has its own ScrollContainer we can remove that. */}
      <ScrollableContainer>
        <StyledThreadByID replace={REPLACE} threadID={threadID} />
      </ScrollableContainer>
    </ClackThreadContext.Provider>
  );
}

function ClackThreadV3({ threadID }: { threadID: string }) {
  const { t } = useTranslation();
  const { messages, loading, hasMore, fetchMore } =
    ThreadSdk.useThreadData(threadID);

  const threadSummary = ThreadSdk.useThreadSummary(threadID);
  if (!threadSummary || messages.length === 0) {
    // this should never happen, the parent will return
    return null;
  }
  const numReplies = threadSummary.total - 1;
  return (
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
                {t('replies', { count: numReplies })}
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
      <StyledComposer autofocus threadId={threadID} showExpanded />
      <TypingIndicator threadID={threadID} />
    </ScrollableContainer>
  );
}

export function ThreadDetails({
  className,
  threadID,
  onClose,
  channel,
}: ThreadDetailsProps) {
  const { t } = useTranslation();
  const { messages } = ThreadSdk.useThreadData(threadID);

  const threadSummary = ThreadSdk.useThreadSummary(threadID);

  if (!threadSummary || messages.length === 0) {
    return <div>{t('loading_messages')}</div>;
  }

  return (
    <ThreadDetailsWrapper className={className}>
      <ThreadDetailsHeader>
        <span style={{ gridArea: 'thread' }}>{t('thread_header')}</span>
        <ChannelName># {channel.id}</ChannelName>
        <CloseButton onClick={onClose}>
          <StyledXMarkIcon />
        </CloseButton>
      </ThreadDetailsHeader>
      <ClackThread threadID={threadID} />
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

const SeparatorWrap = styled.div`
  :is(body, .cord-component) & {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
  }
`;

const SeparatorText = styled.span`
  :is(body, .cord-component) & {
    font-size: 13px;
    color: ${Colors.gray_dark};
  }
`;

const SeparatorLine = styled.hr`
  :is(body, .cord-component) & {
    flex: 1;
    border: none;
    border-top: 1px solid ${Colors.gray_light};
  }
`;

const StyledThreadByID = styled(experimental.Thread.ByID)`
  &.cord-component {
    border: none;
  }
  &.cord-component .cord-composer {
    margin: 0 20px 20px;
  }
  &.cord-component .cord-thread-header-container {
    display: none;
  }
`;
