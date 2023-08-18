import React from 'react';
import styled from 'styled-components';
import { ActionButton } from 'src/client/components/Buttons';
import { ActionModal } from 'src/client/components/ActionModal';

interface SetToActiveModalProps {
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onSetToActive: React.MouseEventHandler<HTMLButtonElement>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
}

export function SetToActiveModal({
  onClose,
  onSetToActive,
  onCancel,
}: SetToActiveModalProps) {
  const savePreferenceToLocalStorage: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.checked) {
      window.localStorage.setItem('dont-ask-again', 'true');
    } else {
      window.localStorage.setItem('dont-ask-again', 'false');
    }
  };

  return (
    <ActionModal
      modalSize={'s'}
      descriptionSize={'s'}
      heading={'Set yourself to active?'}
      description={`You're currently set to away, but it looks like you're back. Want to
    update your availability?`}
      footer={
        <Footer>
          <CheckboxWrapper>
            <Input
              id="dont-ask-again"
              type="checkbox"
              onChange={savePreferenceToLocalStorage}
            />
            <Label htmlFor="dont-ask-again">Don't ask again</Label>
          </CheckboxWrapper>
          <ActionButton $variant="secondary" onClick={onCancel}>
            No Thanks
          </ActionButton>
          <ActionButton $variant="primary" onClick={onSetToActive}>
            Set to Active
          </ActionButton>
        </Footer>
      }
      onClose={onClose}
    />
  );
}

const Input = styled.input({
  cursor: 'pointer',
});

const Label = styled.label({
  cursor: 'pointer',
});

const CheckboxWrapper = styled.div({
  gridArea: 'checkbox',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-template-areas: 'checkbox secondary-button primary-button';
  gap: 12px;
`;
