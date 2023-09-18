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
import { user } from '@cord-sdk/react';
import { useUserStatus } from 'src/client/hooks/useUserStatus';
import { StyledMessage } from 'src/client/components/style/StyledCord';
import { ThreadReplies } from 'src/client/components/ThreadReplies';
import { Colors } from 'src/client/consts/Colors';
import { Options } from 'src/client/components/Options';
import { ProfileDetails } from 'src/client/components/ProfileDetails';
import { PushPinSvg } from 'src/client/components/svg/PushPinSVG';
import { Modal as DefaultModal } from 'src/client/components/Modal';
import { MessageContext } from 'src/client/context/MessageContext';

const backgroundFadeToNone = keyframes`
  from {background-color: #FAF5E5;}
  66% {background-color: #FAF5E5;}
  to {background-color: none;}
`;

export const MessageListItemStyled = styled.div<{
  $isHighlighted?: boolean;
  $isPinned?: boolean;
}>`
  padding: 8px 20px;
  position: relative;
  transition: background-color 0.2s;

  ${({ $isHighlighted }) =>
    $isHighlighted
      ? css`
          animation: ${backgroundFadeToNone} 4s;
        `
      : null}

  ${({ $isPinned }) =>
    $isPinned
      ? css`
          background-color: #faf5e5;
        `
      : css`
          &:hover {
            background-color: ${Colors.gray_highlight};
          }
        `}
`;

export type MessageListItemProps = {
  thread: ThreadSummary;
  onOpenThread: (threadID: string) => void;
};

export function MessageListItem({
  thread,
  onOpenThread,
}: MessageListItemProps) {
  const { threadID: threadIDParam } = useParams();
  const { editingMessage, setEditingMessage } =
    React.useContext(MessageContext);

  useEffect(() => {
    if (thread.id === threadIDParam) {
      ref.current?.scrollIntoView();
    }
    // We want only to scroll to the message the first time it's rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [authorStatus] = useUserStatus(thread.firstMessage?.authorID);
  const [hovered, setHovered] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [profileDetailsPosition, setProfileDetailsPosition] = useState({
    top: 0,
    left: 0,
  });
  const profileDetailsShouldBeShowingRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const [avatarElement, setAvatarElement] = useState<Element | null>(null);

  const profileDetailsTimeoutID = useRef<NodeJS.Timeout | null>(null);

  const queueProfileHoverChange = useCallback(() => {
    if (profileDetailsTimeoutID.current) {
      clearTimeout(profileDetailsTimeoutID.current);
      profileDetailsTimeoutID.current = null;
    }
    profileDetailsTimeoutID.current = setTimeout(() => {
      if (avatarElement) {
        setProfileDetailsPosition({
          top: avatarElement.getBoundingClientRect().top,
          left: avatarElement.getBoundingClientRect().left,
        });
        setShowProfileDetails(profileDetailsShouldBeShowingRef.current);
        profileDetailsTimeoutID.current = null;
      }
    }, 500);
  }, [avatarElement]);

  useLayoutEffect(() => {
    const onMouseEnter = () => {
      profileDetailsShouldBeShowingRef.current = true;
      queueProfileHoverChange();
    };
    avatarElement?.addEventListener('mouseenter', onMouseEnter);

    const onMouseLeave = () => {
      profileDetailsShouldBeShowingRef.current = false;
      queueProfileHoverChange();
    };
    avatarElement?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      avatarElement?.removeEventListener('mouseenter', onMouseEnter);
      avatarElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [avatarElement, queueProfileHoverChange]);

  const isMessageBeingEdited =
    editingMessage &&
    editingMessage.page === 'channel' &&
    editingMessage.messageId === thread.firstMessage?.id;

  const pinnedByUserData = user.useUserData(
    thread.metadata.pinnedBy && typeof thread.metadata.pinnedBy === 'string'
      ? thread.metadata.pinnedBy
      : '',
  );
  const pinnedByUserName = pinnedByUserData?.name;

  return (
    <MessageListItemStyled
      ref={ref}
      $isHighlighted={thread.id === threadIDParam}
      $isPinned={!!thread.metadata.pinned}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {thread.metadata.pinned && (
        <PinLabel>
          <PushPinIcon filled /> <span> Pinned by {pinnedByUserName}</span>
        </PinLabel>
      )}
      <StyledMessage
        threadId={thread.id}
        organizationId={thread.organizationID}
        messageId={thread.firstMessage?.id}
        onRender={() => {
          setAvatarElement(
            document.querySelector(
              `[message-id="${thread.firstMessage?.id}"] .cord-avatar-container`,
            ),
          );
        }}
        isEditing={isMessageBeingEdited}
        onEditEnd={() => {
          setEditingMessage(undefined);
        }}
        $statusEmoji={authorStatus?.emojiUrl ?? undefined}
      />
      <Modal
        isOpen={showProfileDetails}
        onClose={() => setShowProfileDetails(false)}
      >
        <PositionedProfileDetails
          onMouseLeave={() => {
            profileDetailsShouldBeShowingRef.current = false;
            queueProfileHoverChange();
          }}
          onMouseEnter={() => {
            profileDetailsShouldBeShowingRef.current = true;
            queueProfileHoverChange();
          }}
          onClick={(e) => e.stopPropagation()}
          $top={profileDetailsPosition.top}
          $left={profileDetailsPosition.left}
          userID={thread.firstMessage?.authorID || ''}
        />
      </Modal>
      <ThreadReplies summary={thread} onOpenThread={onOpenThread} />
      {!isMessageBeingEdited && (
        <Options
          thread={thread}
          hovered={hovered}
          onOpenThread={onOpenThread}
          page={'channel'}
        />
      )}
    </MessageListItemStyled>
  );
}

const Modal = styled(DefaultModal)`
  pointer-events: none;
`;

const PositionedProfileDetails = styled(ProfileDetails)<{
  $top: number;
  $left: number;
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  translate: 10% -110%;
`;

const PinLabel = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: Colors.gray_dark,
  paddingBottom: '4px',
  paddingLeft: '16px',
  fontSize: '13px',
});

const PushPinIcon = styled(PushPinSvg)`
  stroke: #e8912d;
  fill: #e8912d;
  height: 11px;
  width: 11px;
`;
