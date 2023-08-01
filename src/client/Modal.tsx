import styled from 'styled-components';

export const Modal = styled.div<{ $shouldShow: boolean }>`
  position: absolute;
  top: 0;
  translate: 0 -100%;
  z-index: 1;
  visibility: ${({ $shouldShow }) => ($shouldShow ? 'visible' : 'hidden')};
`;
