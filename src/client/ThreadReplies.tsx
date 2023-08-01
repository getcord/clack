import React from 'react';
import { Facepile, Timestamp } from '@cord-sdk/react';
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
  const numReplies = summary.total - 1;
  if (numReplies < 1) {
    return null;
  }

  let unreadNumber = summary.unread;
  if (summary.firstMessage && !summary.firstMessage.seen) {
    unreadNumber--;
  }

  const hasUnread = unreadNumber > 0;

  // ignoring ts here as lastMessage hasn't been deployed to types packages yet! (27/07)
  const lastReplyTime =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    summary.lastMessage.updatedTimestamp ??
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    summary.lastMessage.createdTimestamp;

  const replyWord = numReplies === 1 ? 'reply' : 'replies';
  return (
    <RepliesWrapper onClick={(_e) => onOpenThread(summary.id)}>
      <Facepile users={summary.repliers} />{' '}
      <RepliesCount>
        {hasUnread ? (
          <UnreadReply>
            <BlueDot />
            <span>
              {unreadNumber} new {unreadNumber === 1 ? 'reply' : 'replies'}
            </span>
          </UnreadReply>
        ) : (
          `${summary.total - 1} ${replyWord}`
        )}
      </RepliesCount>
      <RepliesTimestamp>
        Last reply <StyledTimestamp value={lastReplyTime} />
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

const UnreadReply = styled.div({
  display: 'flex',
  wrap: 'nowrap',
  alignItems: 'center',
  gap: '6px',
});

const BlueDot = styled.div({
  borderRadius: '999px',
  backgroundColor: Colors.blue_unread,
  height: '8px',
  width: '8px',
});
