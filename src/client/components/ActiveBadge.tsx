import styled from 'styled-components';
import { Colors } from 'src/client/consts/Colors';

export const ActiveBadge = styled.div<{ $isActive: boolean }>(
  ({ $isActive }) => ({
    backgroundColor: 'inherit',
    padding: '3px',
    borderRadius: '99px',
    '&::after': {
      cursor: 'pointer',
      content: '""',
      display: 'block',
      borderRadius: '99px',
      height: '9px',
      width: '9px',
      backgroundColor: $isActive ? Colors.green_active : 'inherit',
      boxShadow: $isActive ? 'none' : 'inset 0 0 0 1.5px currentColor',
    },
  }),
);
