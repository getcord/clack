import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    --cord-color-base: ${(props) => props.theme.cord.colorbase};
  }
`;
