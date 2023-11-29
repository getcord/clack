import React from 'react';
import { Facepile, Timestamp } from '@cord-sdk/react';
import { styled } from 'styled-components';
import type { ThreadSummary } from '@cord-sdk/types';
import { Trans, useTranslation } from 'react-i18next';
import { Colors } from 'src/client/consts/Colors';

const RepliesWrapper = styled.div({
  cursor: 'pointer',
  display: 'flex',
  borderRadius: '6px',
  gap: '8px',
  marginLeft: '36px',
  marginTop: '4px',
  paddingLeft: '8px',
  paddingTop: '8px',
  padding: '4px 8px',
  '&:hover': {
    backgroundColor: 'white',
  },
  'cord-facepile': {
    display: 'flex',
    alignItems: 'center',
  },
  '.cord-facepile': {
    display: 'inline-flex',
    gap: '4px',
  },
  '.cord-avatar-container': {
    cursor: 'pointer',
    height: '24px',
    width: '24px',
    marginLeft: 0,
    boxShadow: 'none',
  },
});

const RepliesCount = styled.span({
  alignSelf: 'center',
  color: Colors.blue_active,
  fontSize: '13px',
  fontWeight: 700,
});

const RepliesTimestamp = styled.span({
  alignSelf: 'center',
  color: Colors.gray_dark,
  fontSize: '13px',
});

type ThreadRepliesProps = {
  summary: ThreadSummary;
  onOpenThread: (threadID: string) => void;
};

export function ThreadReplies({ summary, onOpenThread }: ThreadRepliesProps) {
  const { t } = useTranslation();
  const numReplies = summary.total - 1;
  if (numReplies < 1) {
    return null;
  }

  const lastReplyTime =
    summary.lastMessage?.updatedTimestamp ??
    summary.lastMessage?.createdTimestamp;

  return (
    <RepliesWrapper onClick={(_e) => onOpenThread(summary.id)}>
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
