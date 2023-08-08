import React, { createContext, useCallback, useMemo, useState } from 'react';
import { EditMessageModal } from 'src/client/components/editMessageModal';
export const NO_PROVIDER_DEFINED = Symbol.for('NO_PROVIDER_DEFINED');

type MessageContextType = {
  isEditingMessage: string | null | undefined;
  setIsEditingMessage: (editing?: {
    page: string;
    messageId: string | undefined;
  }) => void;
  isMessageModalOpen: boolean;
  setIsMessageModalOpen: (state: boolean) => void;
};

export const MessageContext = createContext<MessageContextType>(
  // TODO: Fix this
  {} as MessageContextType,
);

export function MessageProvider({ children }: React.PropsWithChildren) {
  const [isEditing, setIsEditing] = useState<string | undefined>();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<string | undefined>();
  const [messageId, setMessageId] = useState<string | undefined>();

  const setIsEditingMessage = useCallback(
    (editing?: { page: string; messageId?: string }) => {
      if (isEditing === undefined || !editing) {
        setIsEditing(
          editing ? `${editing.page}/${editing.messageId}` : undefined,
        );
      } else {
        setIsMessageModalOpen(true);
        setPage(editing.page);
        setMessageId(editing.messageId);
      }
    },
    [isEditing],
  );

  const contextValue = useMemo(
    () => ({
      isEditingMessage: isEditing,
      setIsEditingMessage,
      isMessageModalOpen,
      setIsMessageModalOpen,
    }),
    [isEditing, isMessageModalOpen, setIsEditingMessage],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {isMessageModalOpen && (
        <EditMessageModal
          onClose={() => setIsMessageModalOpen(false)}
          onKeepEditing={() => {
            setIsMessageModalOpen(false);
          }}
          onDiscardEdit={() => {
            setIsMessageModalOpen(false);
            setIsEditing(`${page}/${messageId}`);
          }}
        />
      )}
      {children}
    </MessageContext.Provider>
  );
}
