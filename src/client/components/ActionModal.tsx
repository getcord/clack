import React from 'react';
import styled, { css } from 'styled-components';
import { CloseButton } from 'src/client/components/Buttons';

type Size = 's' | 'm';

interface ActionModalProps {
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  heading: string;
  description: string;
  footer: React.ReactNode;
  modalSize?: Size;
  descriptionSize?: Size;
}

export function ActionModal({
  onClose,
  heading,
  description,
  footer,
  modalSize = 'm',
  descriptionSize = 'm',
}: ActionModalProps) {
  return (
    <Modal>
      <Box $size={modalSize}>
        <Heading>{heading}</Heading>
        <CloseButton onClick={onClose} />
        <Description $size={descriptionSize}>{description}</Description>
        <Footer>{footer}</Footer>
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

const Box = styled.div<{ $size: 's' | 'm' }>`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'heading close-button'
    'description description'
    'footer footer';
  background-color: white;
  padding: 24px 28px;
  border-radius: 12px;
  color: black;
  gap: 12px;

  ${({ $size }) =>
    $size === 's'
      ? css`
          max-width: 400px;
        `
      : css`
          min-width: 450px;
          min-height: 150px;
        `}
`;

const Heading = styled.h1({
  gridArea: 'heading',
  marginTop: 0,
  whiteSpace: 'nowrap',
  fontSize: '22px',
});

const Description = styled.p<{ $size?: 's' | 'm' }>`
  grid-area: description;
  margin: 0;
  font-size: 13px;
  padding-bottom: 12px;
  ${({ $size }) =>
    $size === 's'
      ? css`
          font-size: 13px;
          padding-bottom: 12px;
        `
      : css`
          font-size: 15px;
          padding-bottom: 24px;
        `}
`;

const Footer = styled.div({
  gridArea: 'footer',
});
