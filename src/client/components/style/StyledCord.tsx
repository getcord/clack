import { css, styled } from 'styled-components';
import { Composer, Message, Thread } from '@cord-sdk/react';
import { Colors } from 'src/client/consts/Colors';

// .cord-author-name {
//   display: flex;
//   align-items: center;
// }
// .cord-author-name:after {
//   background-image: url(${$statusEmoji});
//   background-size: 16px 16px;
//   content: '';
//   width: 16px;
//   height: 16px;
//   display: inline-block;
//   margin-left: 4px;
// }

export const StyledMessage = styled(Message)<{ $statusEmoji?: string }>`
  .cord-message {
    padding: 0;
    align-items: flex-start;
    background-color: inherit;
    grid-template-columns: auto auto auto auto 1fr auto;
  }
  :where(.cord-editing).cord-message {
    grid-template-rows: auto;
    grid-template-columns: auto 1fr;
  }

  ${({ $statusEmoji }) =>
    $statusEmoji
      ? css`
          .cord-author-name {
            display: flex;
            align-items: center;
          }
          .cord-author-name:after {
            background-image: url(${$statusEmoji});
            content: '';
            margin-left: 4px;
            width: 16px;
            height: 16px;
            display: inline-block;
            background-size: 16px 16px;
          }
        `
      : null}

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

  .cord-composer-primary-buttons button {
    padding: 2px;
    border-radius: 99px;
    height: 24px;
    width: 24px;
    svg {
      width: 14px;
      height: 14px;
    }
  }

  .linkified,
  .cord-message-text a {
    color: ${Colors.blue_link};
    font-weight: 400;
    &:hover {
      color: ${Colors.blue_link};
    }
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
    svg {
      stroke-width: 1.5;
    }
    &:hover {
      background-color: white;
      box-shadow: inset 0 0 0 1px ${Colors.gray_dark};
    }
  }
  .cord-add-reaction:hover {
    svg {
      fill: #f2c744;
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
  .cord-image-attachment {
    max-height: 300px;
  }
  .cord-image {
    max-height: 300px;
    max-width: 300px;
  }
  .cord-sent-via-icon {
    display: flex;
    align-items: end;
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

export const StyledThread = styled(Thread)`
  .cord-message {
    padding: 0;
    align-items: flex-start;
    background-color: inherit;
    grid-template-columns: auto auto auto auto 1fr auto;
  }
  .cord-inline-thread {
    height: auto;
    border: 1px solid #dddddd;
    padding: 12px;
    border-radius: 12px;
    .cord-composer {
      border-radius: 12px;
    }
  }
  .cord-avatar-container {
    height: 36px;
    width: 36px;
  }
`;
