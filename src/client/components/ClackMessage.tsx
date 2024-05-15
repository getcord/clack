import React, { useCallback, useContext, useState } from 'react';
import { betaV2, thread as threadSDK } from '@cord-sdk/react';
import type { ClientMessageData } from '@cord-sdk/types';
import styled from 'styled-components';

import { StyledExperimentalMessage } from 'src/client/components/style/StyledCord';
import { useUserStatus } from 'src/client/hooks/useUserStatus';
import { ThreadReplies } from 'src/client/components/ThreadReplies';
import { MessageListItem4Context } from 'src/client/context/MessageListItem4Context';
import { Options } from 'src/client/components/Options';
import { ClackSendButton } from 'src/client/components/ClackSendButton';

const StyledTimestamp = styled(betaV2.Timestamp)`
  && {
    font-size: var(--cord-font-size-small, 12px);
    align-self: end;
  }
`;

export function ClackMessage({
  message,
  onOpenThread,
  inThreadDetails,
}: {
  message: ClientMessageData;
  onOpenThread: (threadID: string) => void;
  inThreadDetails?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const { thread } = threadSDK.useThread(message.threadID);

  const [replace] = useState(() => {
    const replaceConfig: betaV2.ReplaceConfig = {
      Timestamp: StyledTimestamp,
      Username: UsernameWithStatus,
      OptionsMenu: MessageOptionsMenu,
      Composer: MessageEditComposer,
      SendButton: ClackSendButton,
    };

    if (!inThreadDetails) {
      replaceConfig.Reactions = MessageWithReplies;
    }

    return replaceConfig;
  });

  return (
    <MessageListItem4Context.Provider
      value={{
        onOpenThread,
        threadData: thread ?? undefined,
        messageData: message,
        hovered,
      }}
    >
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <StyledExperimentalMessage
          message={message}
          replace={replace}
          $hasReactions={(message.reactions?.length ?? 0) > 0}
          $hasReplies={(thread?.total ?? 0) > 1}
        />
      </div>
    </MessageListItem4Context.Provider>
  );
}

function MessageWithReplies(props: betaV2.ReactionsProps) {
  const { threadData, onOpenThread, messageData } = useContext(
    MessageListItem4Context,
  );

  const isMessageFirst = messageData?.id === threadData?.firstMessage?.id;
  const reactionCount = threadData?.firstMessage?.reactions?.length ?? 0;

  return (
    <>
      {reactionCount > 0 ? <betaV2.Reactions {...props} /> : null}
      {isMessageFirst && threadData && (
        <ThreadReplies summary={threadData} onOpenThread={onOpenThread} />
      )}
    </>
  );
}

function UsernameWithStatus(props: betaV2.UsernameProps) {
  const { messageData } = useContext(MessageListItem4Context);
  const [authorStatus] = useUserStatus(messageData?.authorID);
  const statusEmojiURL = authorStatus?.emojiUrl ?? undefined;

  return (
    messageData && (
      <UsernameWithStatusWrapper>
        <betaV2.Username {...props} />
        {statusEmojiURL && <img src={statusEmojiURL} />}
      </UsernameWithStatusWrapper>
    )
  );
}

const UsernameWithStatusWrapper = styled.div({
  gridArea: 'authorName',
  display: 'flex',
  flexDirection: 'row',
  gap: 4,
  alignItems: 'center',

  img: {
    height: 16,
    width: 16,
    marginTop: 4,
  },
});

function MessageOptionsMenu(props: betaV2.OptionsMenuProps) {
  const { threadData, hovered, messageData, onOpenThread } = useContext(
    MessageListItem4Context,
  );
  return threadData && messageData ? (
    <Options
      thread={threadData}
      hovered={hovered}
      onOpenThread={
        messageData?.id === threadData?.firstMessage?.id
          ? onOpenThread
          : undefined
      }
      page={'channel'}
      setEditing={props.setEditing}
      message={messageData}
    />
  ) : null;
}

function MessageEditComposer(props: betaV2.ComposerProps) {
  const { messageData } = useContext(MessageListItem4Context);

  return (
    messageData && (
      <StyledComposerWrapper>
        <StyledAvatar userID={messageData.authorID} />
        <StyledComposer {...props} />
      </StyledComposerWrapper>
    )
  );
}

const StyledAvatar = styled(betaV2.Avatar.ByID)`
  && {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
  }
`;

const StyledComposerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 8px 20px;
`;

const StyledComposer = styled(betaV2.Composer)`
  flex-grow: 1;
`;
