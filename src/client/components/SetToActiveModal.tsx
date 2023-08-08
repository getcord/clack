import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { CloseButton, ActionButton } from 'src/client/components/Buttons';

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
    <Modal>
      <Box>
        <Heading>Set yourself to active?</Heading>
        <CloseButton onClick={onClose}>
          <XIcon />
        </CloseButton>
        <Description>
          You're currently set to away, but it looks like you're back. Want to
          update your availability?
        </Description>
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
      </Box>
    </Modal>
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

const Modal = styled.div({
  position: 'absolute',
  height: '100vh',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 999,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Box = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gridTemplateRows: 'auto auto auto',
  gridTemplateAreas: `
    "heading heading close-button"
    "description description description"
    "checkbox secondary-button primary-button"
  `,
  backgroundColor: 'white',
  padding: '20px 24px',
  borderRadius: '12px',
  color: 'black',
  maxWidth: '400px',
  gap: '12px',
});

export const XIcon = styled(XMarkIcon)({
  width: '24px',
  height: '24px',
});

const Heading = styled.h2({
  gridArea: 'heading',
  marginTop: 0,
});

const Description = styled.p({
  gridArea: 'description',
  margin: 0,
  fontSize: '13px',
  paddingBottom: '12px',
});
