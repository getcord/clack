import { styled } from 'styled-components';
import { Colors } from './Colors';

export const MessageListItem = styled.div({
  padding: '8px 20px',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: Colors.gray_highlight,
  },
});
