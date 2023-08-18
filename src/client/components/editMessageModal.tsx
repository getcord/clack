import React from 'react';
import styled from 'styled-components';
import { ActionButton } from 'src/client/components/Buttons';
import { ActionModal } from 'src/client/components/ActionModal';

interface EditMessageModalProps {
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onKeepEditing: React.MouseEventHandler<HTMLButtonElement>;
  onDiscardEdit: React.MouseEventHandler<HTMLButtonElement>;
}

export function EditMessageModal({
  onClose,
  onDiscardEdit,
  onKeepEditing,
}: EditMessageModalProps) {
  return (
    <ActionModal
      heading={'Going somewhere else in Clack?'}
      description={'You will lose any unsaved changes to your message.'}
      onClose={onClose}
      footer={
        <Footer>
          <ActionButton $variant="secondary" onClick={onKeepEditing}>
            Keep Editing
          </ActionButton>
          <ActionButton $variant="alert" onClick={onDiscardEdit}>
            Continue
          </ActionButton>
        </Footer>
      }
    />
  );
}

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
