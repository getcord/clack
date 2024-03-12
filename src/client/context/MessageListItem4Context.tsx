import type { ClientMessageData, ThreadSummary } from '@cord-sdk/types';
import { createContext } from 'react';

type MessageListItem4Type = {
  onOpenThread: (threadID: string) => void;
  threadData: ThreadSummary | undefined;
  messageData: ClientMessageData | undefined;
  hovered: boolean;
};

export const MessageListItem4Context = createContext<MessageListItem4Type>({
  onOpenThread: (_threadID: string) => {},
  threadData: undefined,
  messageData: undefined,
  hovered: false,
});
