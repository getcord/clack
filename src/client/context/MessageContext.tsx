import React, { createContext, useCallback, useMemo, useState } from 'react';
import { EditMessageModal } from 'src/client/components/editMessageModal';
export const NO_PROVIDER_DEFINED = Symbol.for('NO_PROVIDER_DEFINED');

type MessageContextType = {
  editingMessage: string | null | undefined;
  setEditingMessage: (data?: {
    page: string;
    messageId: string | undefined;
  }) => void;
};

export const MessageContext = createContext<MessageContextType>(
  // TODO: Fix this
  {} as MessageContextType,
);

export function MessageProvider({ children }: React.PropsWithChildren) {
  const [editing, setEditing] = useState<string | undefined>();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [messageDetails, setMessageDetails] = useState<string | undefined>();

  const setEditingMessage = useCallback(
    (data?: { page: string; messageId?: string }) => {
      const editingString = data ? `${data.page}/${data.messageId}` : undefined;

      // editing a new messsage
      if (editing === undefined || !data) {
        setEditing(editingString);
      }
      // trying to edit a message while another one is being edited
      else {
        setIsMessageModalOpen(true);
        setMessageDetails(editingString);
      }
    },
    [editing],
  );

  const contextValue = useMemo(
    () => ({
      editingMessage: editing,
      setEditingMessage,
    }),
    [editing, setEditingMessage],
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
            setEditing(messageDetails);
          }}
        />
      )}
      {children}
    </MessageContext.Provider>
  );
}
