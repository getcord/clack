import { styled } from 'styled-components';
import { Colors } from './Colors';
import { Composer, Message } from '@cord-sdk/react';

export const StyledMessage = styled(Message)`
  .cord-message {
    padding: 0;
    align-items: flex-start;
    background-color: inherit;
    grid-template-columns: auto auto auto auto 1fr auto;
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
    box-shadow: inset 0 0 0 1.15px ${Colors.gray_light};
    border-radius: 8px;
    gap: 0;
    padding: 4px;
    color: ${Colors.gray_dark};
    margin-top: -50%;
  }
  .cord-message-options-buttons > .cord-button {
    background-color: white;
    &:hover {
      background-color: ${Colors.gray_highlight};
    }
  }
  .cord-options-menu-trigger {
    display: none;
  }
  .cord-pill,
  .cord-add-reaction {
    border-radius: 99px;
    gap: 4px;
    padding: 4px 8px;
    font-size: 11px;
    line-height: 16px;
    background-color: #efefef;
    &:hover {
      background-color: white;
      box-shadow: inset 0 0 0 1px ${Colors.gray_dark};
    }
  }
  .cord-with-icon > svg {
    height: 20px;
    width: 20px;
  }
  .cord-emoji {
    font-size: 16px;
  }
  .cord-pill > .cord-count {
    font-size: 11px;
  }
  .cord-pill.cord-from-viewer {
    background-color: ${Colors.blue_selected_bg};
    box-shadow: inset 0 0 0 1.5px ${Colors.blue_selected_border};
    &:hover {
      background-color: ${Colors.blue_selected_bg};
    }
  }
  .cord-pill.cord-from-viewer.cord-count {
    color: ${Colors.blue_active};
  }
`;

export const StyledComposer = styled(Composer)`
  display: block;
  grid-area: composer;
  padding: 0 20px 20px;
  .cord-composer {
    border-radius: 8px;
  }
  .cord-composer:focus-within {
    box-shadow: none;
    border: 1px solid ${Colors.gray_border};
  }
`;
