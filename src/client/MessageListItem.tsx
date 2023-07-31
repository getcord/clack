import { styled, keyframes, css } from 'styled-components';
import { Colors } from './Colors';
import type { ThreadSummary } from '@cord-sdk/types';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledMessage } from 'src/client/StyledCord';
import { ThreadReplies } from 'src/client/ThreadReplies';
import React from 'react';
import { Options } from 'src/Options';
import { ProfileDetails } from './ProfileDetails';

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
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const onMouseOverAvatar = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // For some reason typescript doesn't recognise that e.target has more than
    // event listeners 🤷‍♀️
    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [...e.target.classList].some(
        (className: string) =>
          className.includes('cord-avatar') ||
          className.includes('cord-author-name'),
      )
    ) {
      setShowProfileDetails(true);
    }
  };

  const onMouseLeaveAvatar = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setTimeout(() => {
      if (
        // For some reason typescript doesn't recognise that e.target has more than
        // event listeners 🤷‍♀️
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        !e.target.className.includes('cord-avatar') ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        !e.target.className.includes('profile-details-modal')
      ) {
        setShowProfileDetails(false);
      }
    }, 500);
  };

  return (
    <MessageListItemStyled
      ref={ref}
      $isHighlighted={thread.id === threadIDParam}
      onMouseOver={onMouseOverAvatar}
      onMouseLeave={onMouseLeaveAvatar}
    >
      <StyledMessage
        threadId={thread.id}
        messageId={thread.firstMessage?.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <ProfilDetailsModal
        shouldShow={showProfileDetails}
        userID={thread.firstMessage?.authorID || ''}
        onMouseLeave={onMouseLeaveAvatar}
      />
      <ThreadReplies summary={thread} onOpenThread={onOpenThread} />
      <Options thread={thread} hovered={hovered} onOpenThread={onOpenThread} />
    </MessageListItemStyled>
  );
}

function ProfilDetailsModal({
  shouldShow,
  userID,
  onMouseLeave,
}: {
  onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
  shouldShow: boolean;
  userID: string;
}) {
  return (
    <Modal
      $shouldShow={shouldShow}
      className="profile-details-modal"
      onMouseLeave={onMouseLeave}
    >
      <ProfileDetails userID={userID} />
    </Modal>
  );
}

const Modal = styled.div<{ $shouldShow: boolean }>`
  position: absolute;
  top: 0;
  translate: 0 -100%;
  z-index: 1;
  visibility: ${({ $shouldShow }) => ($shouldShow ? 'visible' : 'hidden')};
`;
