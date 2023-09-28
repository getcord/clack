import type { PropsWithChildren } from 'react';
import React from 'react';
import styled from 'styled-components';
import { ReactPortal } from 'src/client/components/ReactPortal';

interface ModalProps extends PropsWithChildren {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onOutsideClick?: () => void;
  onMouseLeaveModal?: () => void;
  className?: string;
}

export function Modal({
  id,
  onClose,
  isOpen,
  onOutsideClick,
  onMouseLeaveModal,
  children,
  className,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <ReactPortal wrapperID={id}>
      <Container
        className={className}
        onClick={onOutsideClick || onClose}
        onMouseOver={onMouseLeaveModal}
      >
        {children}
      </Container>
    </ReactPortal>
  );
}

const Container = styled.div({
  position: 'relative',
  pointerEvents: 'auto',
  height: '100%',
  width: '100%',
});
