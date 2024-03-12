import React from 'react';
import { thread } from '@cord-sdk/react';
import type { MessageListItemProps } from 'src/client/components/MessageListItem';
import { ClackMessage } from 'src/client/components/ClackMessage';

export function MessageListItem4({
  thread: threadData,
  onOpenThread,
}: MessageListItemProps) {
  const message = thread.useMessage(threadData.firstMessage?.id ?? '');

  if (!message) {
    return null;
  }

  return <ClackMessage message={message} onOpenThread={onOpenThread} />;
}
