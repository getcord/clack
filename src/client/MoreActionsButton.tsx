import React from 'react';
import {
  OPTIONS_ICON_HEIGHT,
  OPTIONS_ICON_WIDTH,
  OptionsButton,
} from 'src/client/Options';
import { Tooltip } from 'react-tooltip';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { styled, css } from 'styled-components';
import { Colors } from 'src/client/Colors';
import type { MessageData, ThreadSummary } from '@cord-sdk/types';
import { FRONT_END_HOST } from 'src/client/consts';
import { useCordToken } from 'src/client/app';

export function MoreActionsButton({
  thread,
  message,
  showOptionsDialog,
  setShowOptionsDialog,
}: {
  thread: ThreadSummary;
  message?: MessageData;
  showOptionsDialog: boolean;
  setShowOptionsDialog: (state: boolean) => void;
}) {
  const [_, cordUserID] = useCordToken();
  const messageData = message ?? thread.firstMessage;

  const subscribedToThread =
    cordUserID &&
    thread.participants
      .map((participant) => participant.userID)
      .includes(cordUserID);

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

  const onMoreOptionsClick = React.useCallback(() => {
    setShowOptionsDialog(true);
  }, [setShowOptionsDialog]);

  const onSubscribeOrUnsubscribe = React.useCallback(async () => {
    await window.CordSDK?.thread.setSubscribed(thread.id, !subscribedToThread);
    setShowOptionsDialog(false);
  }, [setShowOptionsDialog, subscribedToThread, thread]);

  const onCopyButtonClick = React.useCallback(() => {
    const channel = thread.location.channel;
    const url = `${FRONT_END_HOST}/${channel}/thread/${thread.id}`;
    void navigator.clipboard.writeText(url);
    setShowOptionsDialog(false);
  }, [setShowOptionsDialog, thread]);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Tooltip id="more-actions-button" />
        <OptionsButton
          data-tooltip-id="more-actions-button"
          data-tooltip-content="More actions"
          data-tooltip-place="top"
        >
          <EllipsisVerticalIcon
            onClick={onMoreOptionsClick}
            width={OPTIONS_ICON_WIDTH}
            height={OPTIONS_ICON_HEIGHT}
          />
        </OptionsButton>
        <Dialog $shouldShow={showOptionsDialog}>
          <StyledButton onClick={() => void onSubscribeOrUnsubscribe()}>
            Turn {subscribedToThread ? 'off' : 'on'} notifications for reply
          </StyledButton>
          <Divider />

          <StyledButton onClick={onCopyButtonClick}> Copy link</StyledButton>

          {cordUserID === messageData?.authorID &&
            messageData?.deletedTimestamp === null && (
              <>
                <Divider />
                <StyledButton
                  $type="alert"
                  onClick={() => void onDeleteMessage()}
                >
                  Delete message
                </StyledButton>
              </>
            )}
        </Dialog>
      </div>
      <Overlay
        onClick={() => setShowOptionsDialog(false)}
        $shouldShow={showOptionsDialog}
      />
    </>
  );
}

const StyledButton = styled.button<{ $type?: string }>`
  font-size: 15px;
  line-height: 18px;
  padding: 0 28px;
  min-height: 28px;
  border: none;
  cursor: pointer;
  width: 100%;
  background: transparent;
  text-align: left;
  color: ${({ $type }) => ($type === 'alert' ? Colors.red : '#1d1d1c')};

  &:hover {
    background: ${({ $type }) =>
      $type === 'alert' ? Colors.red : Colors.blue_active};

    color: white;
  }
`;

export const Dialog = styled.div<{ $shouldShow: boolean }>`
  position: absolute;
  top: -25px;
  translate: -100% 0;
  z-index: 3;
  visibility: ${({ $shouldShow }) => ($shouldShow ? 'visible' : 'hidden')};
  min-width: 360px;
  min-height: 50px;
  border-radius: 6px;
  background-color: white;
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
