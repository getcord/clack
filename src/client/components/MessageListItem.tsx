import { styled, keyframes, css } from 'styled-components';
import type { ThreadSummary } from '@cord-sdk/types';
import { useParams } from 'react-router-dom';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { StyledMessage } from 'src/client/components/style/StyledCord';
import { ThreadReplies } from 'src/client/components/ThreadReplies';
import { Colors } from 'src/client/consts/Colors';
import { Options } from 'src/client/components/Options';
import { ProfileDetails } from 'src/client/components/ProfileDetails';
import { Modal } from 'src/client/components/Modal';

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
  const [hoveredProfileDetails, setHoveredProfileDetails] = useState(false);
  const [profileDetailsPosition, setProfileDetailsPosition] = useState({
    top: 0,
    left: 0,
  });
  const ref = useRef<HTMLDivElement>(null);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const [avatarElement, setAvatarElement] = useState<Element | null>(null);

  const showProfileDetailsTimeoutID = useRef<NodeJS.Timeout | null>(null);
  const hideProfileDetailsTimeoutID = useRef<NodeJS.Timeout | null>(null);

  const queueHideProfileDetails = useCallback(
    (timeoutID: NodeJS.Timeout | null) => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      hideProfileDetailsTimeoutID.current = setTimeout(() => {
        if (avatarElement) {
          setShowProfileDetails(false);
        }
      }, 500);
    },
    [avatarElement],
  );

  const queueShowProfileDetails = useCallback(
    (timeoutID: NodeJS.Timeout | null) => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      showProfileDetailsTimeoutID.current = setTimeout(() => {
        if (avatarElement) {
          setProfileDetailsPosition({
            top: avatarElement.getBoundingClientRect().top,
            left: avatarElement.getBoundingClientRect().left,
          });
          setShowProfileDetails(true);
        }
      }, 500);
    },
    [avatarElement],
  );

  useLayoutEffect(() => {
    const onMouseEnter = () =>
      queueShowProfileDetails(hideProfileDetailsTimeoutID.current);
    avatarElement?.addEventListener('mouseenter', onMouseEnter);

    const onMouseLeave = () =>
      queueHideProfileDetails(showProfileDetailsTimeoutID.current);
    avatarElement?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      avatarElement?.removeEventListener('mouseenter', onMouseEnter);
      avatarElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [
    avatarElement,
    hoveredProfileDetails,
    queueHideProfileDetails,
    queueShowProfileDetails,
  ]);

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
        onRender={() => {
          setAvatarElement(
            document.querySelector(
              `[message-id="${thread.firstMessage?.id}"] .cord-avatar-container`,
            ),
          );
        }}
      />
      <Modal
        isOpen={showProfileDetails}
        onClose={() => setShowProfileDetails(false)}
      >
        <PositionedProfileDetails
          onMouseLeave={() => {
            queueHideProfileDetails(null);
            setHoveredProfileDetails(false);
          }}
          onMouseEnter={() => {
            queueShowProfileDetails(hideProfileDetailsTimeoutID.current);
          }}
          $top={profileDetailsPosition.top}
          $left={profileDetailsPosition.left}
          userID={thread.firstMessage?.authorID || ''}
        />
      </Modal>
      <ThreadReplies summary={thread} onOpenThread={onOpenThread} />
      <Options thread={thread} hovered={hovered} onOpenThread={onOpenThread} />
    </MessageListItemStyled>
  );
}

const PositionedProfileDetails = styled(ProfileDetails)<{
  $top: number;
  $left: number;
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  translate: 10% -110%;
`;