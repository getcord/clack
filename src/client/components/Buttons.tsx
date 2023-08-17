import styled from 'styled-components';
import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Colors } from 'src/client/consts/Colors';

export const ActionButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'alert';
}>(({ $variant }) => ({
  all: 'unset',
  gridArea: `${$variant}-button`,
  cursor: 'pointer',
  backgroundColor:
    $variant === 'primary'
      ? Colors.green
      : $variant === 'alert'
      ? Colors.red
      : 'inherit',
  color: ['primary', 'alert'].includes($variant) ? 'white' : 'inherit',
  padding: '8px 16px',
  border: `1px solid ${Colors.gray_border}`,
  borderRadius: '4px',
}));

export const StyledCloseButton = styled.button({
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

export const XIcon = styled(XMarkIcon)({
  width: '24px',
  height: '24px',
});

export function CloseButton({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <StyledCloseButton onClick={onClick}>
      <XIcon />
    </StyledCloseButton>
  );
}
