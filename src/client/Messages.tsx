import React from 'react';
import { Message, thread } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Colors } from './Colors';

interface MessagesProps {
  channel: string;
}

export function Messages({ channel }: MessagesProps) {
  const { threads } = thread.useLocationData(
    { channel },
    {
      sortDirection: 'ascending',
    },
  );

  return threads.map((thread) => (
    <StyledMessage
      key={thread.id}
      threadId={thread.id}
      messageId={thread.firstMessage?.id}
    />
  ));
}

const StyledMessage = styled(Message)`
  .cord-message {
    padding: 8px 20px;
    align-items: flex-start;
    background-color: inherit;
    grid-template-columns: auto auto auto auto 1fr auto;
    transition: background-color 0.2s;
    &:hover {
      background-color: ${Colors.light_gray};
    }
  }
  .cord-thread {
    border: none;
  }
  .cord-thread-container {
    height: auto;
  }
  .cord-collapsed-thread {
    border: none;
  }
  .cord-avatar-container {
    height: 36px;
    width: 36px;
  }
  .cord-message-options-buttons {
    flex-direction: row;
    background-color: white;
    border: 1px solid ${Colors.light_gray};
    gap: 0;
    padding: 4px;
    color: ${Colors.dark_gray};
  }
  .cord-message-options-buttons > .cord-button {
    background-color: white;
    &:hover {
      background-color: ${Colors.light_gray};
    }
  }
  .cord-pill,
  .cord-add-reaction {
    border-radius: 12px;
    padding: 4px 6px;
    font-size: 11px;
    line-height: 16px;
  }
  .cord-with-icon > svg {
    height: 20px;
    width: 20px;
  }
  .cord-emoji {
    font-size: 16px;
  }
  .cord-from-viewer {
    background-color: ${Colors.blue_selected_bg};
    box-shadow: inset 0 0 0 1.5px ${Colors.blue_selected_border};
    &:hover {
      background-color: ${Colors.blue_selected_bg};
    }
  }
  .cord-from-viewer > .cord-count {
    color: ${Colors.blue_active};
  }
`;
