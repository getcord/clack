import styled, { keyframes } from 'styled-components';
import { Colors } from 'src/client/consts/Colors';

const slideIn = keyframes`
  0% {
    translate: 0 -100%;
  }
  100% {
    translate: 0% 100%;
  }
`;

const slideOut = keyframes`
  0% {
    translate: 0% 100%;
  }
  100% {
    translate: 0% -100%;
  }
`;

// top is 18px to sit underneath the channel details bar
export const Toolbar = styled.div<{ $showToolbar: boolean }>`
  position: absolute;
  width: 100%;
  top: 18px;
  animation: ${({ $showToolbar }) => ($showToolbar ? slideIn : slideOut)} 0.5s
    ease;
  translate: ${({ $showToolbar: showToolbar }) =>
    `0% ${showToolbar ? '100%' : '-100%'}`};
  z-index: 1;
  background-color: white;
  border-top: 1px solid ${Colors.gray_light};
  border-bottom: 1px solid ${Colors.gray_light};
  font-size: 13px;
  color: ${Colors.gray_dark};
  padding: 10px 20px;
`;
