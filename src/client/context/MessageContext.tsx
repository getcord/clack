import React, { createContext, useCallback, useMemo, useState } from 'react';
import { EditMessageModal } from 'src/client/components/editMessageModal';

type MessageContextType = {
  editingMessage: EditingMessageInfo | undefined;
  setEditingMessage: (data?: EditingMessageInfo) => void;
};

type EditingMessageInfo = {
  page: 'channel' | 'threadDetails';
  messageId?: string;
};
export const MessageContext = createContext<MessageContextType>(
  // TODO: Fix this
  {} as MessageContextType,
);

export function MessageProvider({ children }: React.PropsWithChildren) {
  const [editing, setEditing] = useState<EditingMessageInfo | undefined>();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [messageDetails, setMessageDetails] = useState<
    EditingMessageInfo | undefined
  >();

  const setEditingMessage = useCallback(
    (data?: EditingMessageInfo) => {
      // editing a new messsage
      if (editing === undefined || !data) {
        setEditing(data);
      }
      // trying to edit a message while another one is being edited
      else {
        setIsMessageModalOpen(true);
        // save the message to be edited here until the modal action is
        // selected (whether to discard or keep the message)
        setMessageDetails(data);
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
