import { styled, css } from 'styled-components';
import { Reactions } from '@cord-sdk/react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import type { CoreMessageData, ThreadSummary } from '@cord-sdk/types';
import React, { useCallback, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { Colors } from 'src/client/consts/Colors';
import { MoreActionsButton } from 'src/client/components/MoreActionsButton';

export const OPTIONS_ICON_HEIGHT = 20;
export const OPTIONS_ICON_WIDTH = 20;

interface OptionsProps {
  thread: ThreadSummary;
  hovered: boolean;
  onOpenThread?: (threadID: string) => void;
  message?: CoreMessageData;
}

export function Options({
  thread,
  hovered,
  onOpenThread,
  message,
}: OptionsProps) {
  const [optionsHovered, setOptionsHovered] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);

  const onMouseEnter = useCallback(() => {
    setOptionsHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setOptionsHovered(false);
  }, []);

  return (
    (hovered || optionsHovered || showOptionsDialog) && (
      <OptionsStyled onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Tooltip id="reactions-button" />
        <div
          data-tooltip-id="reactions-button"
          data-tooltip-content="Find another reaction"
          data-tooltip-place="top"
        >
          <Reactions
            threadId={thread.id}
            messageId={message?.id ?? thread.firstMessage?.id}
          />
        </div>
        <Tooltip id="options-button" />
        {onOpenThread && (
          <OptionsButton
            onClick={() => onOpenThread(thread.id)}
            data-tooltip-id="options-button"
            data-tooltip-content="Reply in thread"
            data-tooltip-place="top"
          >
            <ChatBubbleOvalLeftEllipsisIcon
              height={OPTIONS_ICON_HEIGHT}
              width={OPTIONS_ICON_WIDTH}
            />
          </OptionsButton>
        )}
        <MoreActionsButton
          thread={thread}
          message={message}
          showOptionsDialog={showOptionsDialog}
          setShowOptionsDialog={setShowOptionsDialog}
        />
      </OptionsStyled>
    )
  );
}

const buttonStyle = css`
  background: none;
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Colors.gray_dark};
  cursor: pointer;
  border-radius: 8px;
  padding: 0;

  &:hover {
    background-color: ${Colors.gray_highlight};
    color: black;
  }
`;

const OptionsStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  position: absolute;
  right: 12px;
  top: -24px;
  background-color: white;
  box-shadow: inset 0 0 0 1.15px ${Colors.gray_light};
  border-radius: 8px;
  padding: 4px;

  .cord-reaction-list {
    display: none;
  }

  .cord-add-reaction {
    ${buttonStyle}

    svg {
      height: ${OPTIONS_ICON_HEIGHT}px;
      width: ${OPTIONS_ICON_WIDTH}px;

      path {
        stroke-width: 1.3px;
      }
    }
  }
`;

export const OptionsButton = styled.div`
  height: 30px;
  width: 30px;
  ${buttonStyle}
`;
