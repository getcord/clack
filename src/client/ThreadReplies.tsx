import React from 'react';
import { Facepile } from '@cord-sdk/react';
import { styled } from 'styled-components';
import type { ThreadSummary } from '@cord-sdk/types';
import { Colors } from './Colors';

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
});

const RepliesTimestamp = styled.span({
  alignSelf: 'center',
  color: Colors.gray_dark,
});

type ThreadRepliesProps = {
  summary: ThreadSummary;
  onOpenThread: (threadID: string) => void;
};

export function ThreadReplies({ summary, onOpenThread }: ThreadRepliesProps) {
  const numReplies = summary.total - 1;
  if (numReplies < 1) {
    return null;
  }

  const replyWord = numReplies === 1 ? 'reply' : 'replies';
  return (
    <RepliesWrapper onClick={(_e) => onOpenThread(summary.id)}>
      <Facepile users={summary.repliers} />{' '}
      <RepliesCount>
        {summary.total - 1} {replyWord}
      </RepliesCount>
      <RepliesTimestamp>Last reply 999 days ago</RepliesTimestamp>
    </RepliesWrapper>
  );
}
