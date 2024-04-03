import React, { useContext } from 'react';
import { Facepile, Timestamp } from '@cord-sdk/react';
import { css, styled } from 'styled-components';
import type { ThreadSummary } from '@cord-sdk/types';
import { Trans, useTranslation } from 'react-i18next';
import { Colors } from 'src/client/consts/Colors';
import {
  type CordVersion,
  CordVersionContext,
} from 'src/client/context/CordVersionContext';

const RepliesWrapper = styled.div<{ $cordVersion: CordVersion }>`
  && {
    grid-area: replies;
    cursor: pointer;
    display: flex;
    border-radius: 6px;
    gap: 8px;
    ${(props) =>
      props.$cordVersion === '3.0'
        ? css`
            margin-left: 36px;
            margin-top: 4px;
          `
        : ''}
    padding: 4px 8px;

    &:hover {
      background-color: white;
    }

    cord-facepile {
      display: flex;
      align-items: center;
    }

    .cord-facepile {
      display: inline-flex;
      gap: 4px;
    }

    .cord-avatar-container {
      cursor: pointer;
      height: 24px;
      width: 24px;
      margin-left: 0;
      box-shadow: none;
    }
  }
`;

const RepliesCount = styled.span`
  && {
    align-self: center;
    color: ${Colors.blue_active};
    font-size: 13px;
    font-weight: 700;
  }
`;

const RepliesTimestamp = styled.span`
  && {
    align-self: center;
    color: ${Colors.gray_dark};
    font-size: 13px;
  }
`;

type ThreadRepliesProps = {
  summary: ThreadSummary;
  onOpenThread: (threadID: string) => void;
};

export function ThreadReplies({ summary, onOpenThread }: ThreadRepliesProps) {
  const { t } = useTranslation();
  const { version } = useContext(CordVersionContext);

  const numReplies = summary.total - 1;
  if (numReplies < 1) {
    return null;
  }

  const lastReplyTime =
    summary.lastMessage?.updatedTimestamp ??
    summary.lastMessage?.createdTimestamp;

  return (
    <RepliesWrapper
      onClick={(_e) => onOpenThread(summary.id)}
      $cordVersion={version}
    >
      <Facepile users={summary.repliers} />{' '}
      <RepliesCount>{t('replies', { count: numReplies })}</RepliesCount>
      <RepliesTimestamp>
        <Trans
          t={t}
          i18nKey={'last_reply'}
          components={{
            timestamp: <StyledTimestamp value={lastReplyTime} />,
          }}
        ></Trans>
      </RepliesTimestamp>
    </RepliesWrapper>
  );
}

const StyledTimestamp = styled(Timestamp)`
  .cord-timestamp {
    display: inline;
    color: ${Colors.gray_dark};
    font-size: 13px;
  }
`;
