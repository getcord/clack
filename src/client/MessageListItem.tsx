import { styled, keyframes, css } from 'styled-components';
import { Colors } from './Colors';
import type { ThreadSummary } from '@cord-sdk/types';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledMessage } from 'src/client/StyledCord';
import { ThreadReplies } from 'src/client/ThreadReplies';
import React from 'react';
import { Options } from 'src/Options';

const backgroundFadeToNone = keyframes`
  from {background-color: #FAF5E5;}
  66% {background-color: #FAF5E5;}
  to {background-color: none;}
`;

export const MessageListItemStyled = styled.div<{ $isHighlighted?: boolean }>`
  padding: 8px 20px;
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${Colors.gray_highlight};
  }

  position: relative;
  ${({ $isHighlighted }) =>
    $isHighlighted
      ? css`
          animation: ${backgroundFadeToNone} 4s;
        `
      : null}
`;

export function MessageListItem({
  thread,
  onOpenThread,
}: {
  thread: ThreadSummary;
  onOpenThread: (threadID: string) => void;
}) {
  const { threadID: threadIDParam } = useParams();

  useEffect(() => {
    if (thread.id === threadIDParam) {
      ref.current?.scrollIntoView();
    }
    // We want only to scroll to the message the first time it's rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <MessageListItemStyled
      ref={ref}
      $isHighlighted={thread.id === threadIDParam}
    >
      <StyledMessage
        threadId={thread.id}
        messageId={thread.firstMessage?.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <ThreadReplies summary={thread} onOpenThread={onOpenThread} />
      <Options thread={thread} hovered={hovered} onOpenThread={onOpenThread} />
    </MessageListItemStyled>
  );
}
