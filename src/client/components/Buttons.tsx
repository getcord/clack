import styled from 'styled-components';
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

export const CloseButton = styled.button({
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
