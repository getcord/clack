import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { Colors } from 'src/client/Colors';

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
        <Button $variant="secondary" onClick={onCancel}>
          No Thanks
        </Button>
        <Button $variant="primary" onClick={onSetToActive}>
          Set to Active
        </Button>
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

const CloseButton = styled.button({
  all: 'unset',
  gridArea: 'close-button',
  cursor: 'pointer',
  color: Colors.gray_dark,
  justifySelf: 'end',
  height: 'fit-content',
  lineHeight: 0,
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: Colors.gray_highlight,
  },
});

const XIcon = styled(XMarkIcon)({
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

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>(
  ({ $variant }) => ({
    all: 'unset',
    gridArea: `${$variant}-button`,
    cursor: 'pointer',
    backgroundColor: $variant === 'primary' ? Colors.green : 'inherit',
    color: $variant === 'primary' ? 'white' : 'inherit',
    padding: '8px 16px',
    border: `1px solid ${Colors.gray_border}`,
    borderRadius: '4px',
  }),
);
