import React, { useRef, useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { styled, css } from 'styled-components';
import type { CoreMessageData, ThreadSummary } from '@cord-sdk/types';
import { CordContext } from '@cord-sdk/react';
import { Modal as DefaultModal } from 'src/client/components/Modal';
import { Colors } from 'src/client/consts/Colors';
import {
  OPTIONS_ICON_HEIGHT,
  OPTIONS_ICON_WIDTH,
  OptionsButton,
} from 'src/client/components/Options';
import { FRONT_END_HOST } from 'src/client/consts/consts';
import { MessageContext } from 'src/client/context/MessageContext';

export function MoreActionsButton({
  thread,
  message,
  showOptionsDialog,
  setShowOptionsDialog,
  page,
  setEditing,
}: {
  thread: ThreadSummary;
  message?: CoreMessageData;
  showOptionsDialog: boolean;
  setShowOptionsDialog: (state: boolean) => void;
  page: 'threadDetails' | 'channel';
  setEditing?: (state: boolean) => void;
}) {
  const { userID: cordUserID } = React.useContext(CordContext);
  const { setEditingMessage } = React.useContext(MessageContext);
  const messageData = message ?? thread.firstMessage;

  const initialSubscribedToThread =
    cordUserID && thread.subscribers.includes(cordUserID);
  const [subscribedToThread, setSubscribedToThread] = useState(
    initialSubscribedToThread,
  );

  const onEditMessage = React.useCallback(() => {
    setEditing
      ? setEditing(true)
      : setEditingMessage({ page, messageId: messageData?.id });
    setShowOptionsDialog(false);
  }, [
    messageData?.id,
    page,
    setEditing,
    setShowOptionsDialog,
    setEditingMessage,
  ]);

  const onDeleteMessage = React.useCallback(async () => {
    if (!messageData) {
      return;
    }

    await window.CordSDK?.thread.updateMessage(
      messageData.threadID,
      messageData.id,
      {
        deleted: true,
      },
    );
    setShowOptionsDialog(false);
  }, [setShowOptionsDialog, messageData]);

  const moreOptionsButtonRef = useRef<HTMLDivElement>(null);
  const [menuPopoutPosition, setMenuPopoutPosition] = useState({
    top: 0,
    left: 0,
  });

  const onMoreOptionsClick = React.useCallback(() => {
    if (!moreOptionsButtonRef.current) {
      return;
    }
    setMenuPopoutPosition({
      top: moreOptionsButtonRef.current.getBoundingClientRect().top,
      left: moreOptionsButtonRef.current.getBoundingClientRect().right,
    });
    setShowOptionsDialog(true);
  }, [setShowOptionsDialog]);

  const onSubscribeOrUnsubscribe = React.useCallback(async () => {
    await window.CordSDK?.thread.setSubscribed(thread.id, !subscribedToThread);
    setShowOptionsDialog(false);
    setSubscribedToThread(!subscribedToThread);
  }, [setShowOptionsDialog, subscribedToThread, thread]);

  // TODO This is currently not v useful because it will mark itself as read a few s
  // later since it's on screen - need to think of a solution
  const onMarkUnread = React.useCallback(async () => {
    await window.CordSDK?.thread.setSeen(thread.id, false);
    setShowOptionsDialog(false);
  }, [setShowOptionsDialog, thread.id]);

  const onCopyButtonClick = React.useCallback(() => {
    const channel = thread.location.channel;
    const url = `${FRONT_END_HOST}/channel/${channel}/thread/${thread.id}`;
    void navigator.clipboard.writeText(url);
    setShowOptionsDialog(false);
  }, [setShowOptionsDialog, thread]);

  const onPinToConversation = () => {
    const threadIsAlreadyPinned = !!thread.metadata.pinned;
    const metadata: { pinned?: boolean; pinnedBy?: string } = {
      pinned: !threadIsAlreadyPinned,
      pinnedBy: !threadIsAlreadyPinned ? cordUserID : undefined,
    };
    window.CordSDK?.thread
      .updateThread(thread.id, {
        metadata,
      })
      .catch((e) =>
        console.error(`Having issues pinning the thread ${thread.name}: ${e}`),
      );
  };

  const keyboardEvents: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.key === 'p') {
      onPinToConversation();
      setShowOptionsDialog(false);
    } else if (e.key === 'e') {
      void onEditMessage();
    } else if (e.key === 'Backspace') {
      void onDeleteMessage();
    } else if (e.key === 'u') {
      void onMarkUnread();
    }
  };

  return (
    <>
      <div
        style={{ position: 'relative' }}
        onKeyDown={keyboardEvents}
        tabIndex={0}
      >
        <OptionsButton
          ref={moreOptionsButtonRef}
          data-tooltip-id="options-menu-tooltip"
          data-tooltip-content="More actions"
          data-tooltip-place="top"
          onClick={onMoreOptionsClick}
        >
          <EllipsisVerticalIcon
            width={OPTIONS_ICON_WIDTH}
            height={OPTIONS_ICON_HEIGHT}
          />
        </OptionsButton>
        <Modal
          id="options-menu-modal"
          isOpen={showOptionsDialog}
          onClose={() => setShowOptionsDialog(false)}
        >
          <Dialog
            $top={menuPopoutPosition.top}
            $left={menuPopoutPosition.left}
            $shouldShow={showOptionsDialog}
          >
            <StyledButton onClick={() => void onSubscribeOrUnsubscribe()}>
              {subscribedToThread
                ? 'Turn off notifications for replies'
                : 'Get notified about new replies'}{' '}
            </StyledButton>
            <Divider />
            <StyledButton onClick={() => void onMarkUnread()}>
              Mark unread
              <KeyBindingLabel>U</KeyBindingLabel>
            </StyledButton>
            <Divider />
            <StyledButton onClick={onCopyButtonClick}>Copy link</StyledButton>
            <Divider />
            <StyledButton onClick={onPinToConversation}>
              {thread.metadata.pinned ? 'Unpin' : 'Pin'} this conversation{' '}
              <KeyBindingLabel>P</KeyBindingLabel>
            </StyledButton>

            {cordUserID === messageData?.authorID &&
              messageData?.deletedTimestamp === null && (
                <>
                  <Divider />
                  <StyledButton onClick={() => void onEditMessage()}>
                    Edit message
                    <KeyBindingLabel>E</KeyBindingLabel>
                  </StyledButton>
                  <StyledButton
                    $type="alert"
                    onClick={() => void onDeleteMessage()}
                  >
                    Delete message...
                    <KeyBindingLabel>delete</KeyBindingLabel>
                  </StyledButton>
                </>
              )}
          </Dialog>
        </Modal>
      </div>
      <Overlay
        onClick={() => {
          setShowOptionsDialog(false);
        }}
        $shouldShow={showOptionsDialog}
      />
    </>
  );
}

export const Modal = styled(DefaultModal)`
  pointer-events: none;
`;

const StyledButton = styled.button<{ $type?: string }>`
  font-size: 15px;
  line-height: 18px;
  padding: 0 28px;
  min-height: 28px;
  border: none;
  cursor: pointer;
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: ${({ $type }) => ($type === 'alert' ? Colors.red : '#1d1d1c')};

  &:hover {
    background: ${({ $type }) =>
      $type === 'alert' ? Colors.red : Colors.blue_active};
    color: white;
  }
`;

const KeyBindingLabel = styled.span`
  text-align: right;
  color: ${Colors.gray_dark};
  ${StyledButton}:hover & {
    color: white;
  }
`;

export const Dialog = styled.div<{
  $shouldShow: boolean;
  $top: number;
  $left: number;
}>`
  pointer-events: auto;
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  translate: -110% -10%;
  visibility: ${({ $shouldShow }) => ($shouldShow ? 'visible' : 'hidden')};
  background-color: ${Colors.gray_menu_bg};
  min-width: 360px;
  min-height: 50px;
  width: fit-content;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1.15px ${Colors.gray_light};
  padding: 20px 0;
`;

export const Overlay = styled.div<{ $shouldShow: boolean }>`
  ${({ $shouldShow }) =>
    $shouldShow
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        `
      : css`
          display: none;
          border: 20px solid red;
        `}};
`;

export const Divider = styled.hr`
  border-top: 1px solid #1d1c1d21;
  margin: 8px 0;
`;
