import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { CloseButton } from 'src/client/components/Buttons';

interface ActionModalProps {
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  heading: string;
  description: string;
  footer: React.ReactNode;
}

export function ActionModal({
  onClose,
  heading,
  description,
  footer,
}: ActionModalProps) {
  return (
    <Modal>
      <Box>
        <Heading>{heading}</Heading>
        <CloseButton onClick={onClose}>
          <XIcon />
        </CloseButton>
        <Description>{description}</Description>
        {footer}
      </Box>
    </Modal>
  );
}

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
    "footer footer footer"
  `,
  backgroundColor: 'white',
  padding: '24px 28px',
  borderRadius: '12px',
  color: 'black',
  minWidth: '450px',
  minHeight: '150px',
  gap: '12px',
});

export const XIcon = styled(XMarkIcon)({
  width: '24px',
  height: '24px',
});

const Heading = styled.h1({
  gridArea: 'heading',
  marginTop: 0,
  whiteSpace: 'nowrap',
  fontSize: '22px',
});

const Description = styled.p({
  gridArea: 'description',
  margin: 0,
  fontSize: '15px',
  paddingBottom: '24px',
});
