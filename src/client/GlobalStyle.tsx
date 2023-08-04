import {  createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Lato;
    src: url('/static/lato-bold.woff2') format('woff2');
    font-weight: 700;
  }

  @font-face {
    font-family: Lato;
    src: url('/static/lato-regular.woff2') format('woff2');
    font-weight: 400;
  } 
  @font-face {
    font-family: Lato;
    src: url('/static/lato-black.woff2') format('woff2');
    font-weight: 900;
  } 
  
  html,
  body {
    height: 100vh;
    margin: 0;
    font-family: Lato, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
          'Helvetica Neue', sans-serif;
    --cord-font-family: Lato, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    font-size: 15px;
    --cord-font-size-body: '15px';
    color: rgb(29,28,29);
    --cord-color-content-primary: rgb(29,28,29);
    --cord-line-height-body: 1.46668;
    --cord-composer-height-max: 67vh;
  }

  button {
    font-family: Lato, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
          'Helvetica Neue', sans-serif;
    --cord-font-family: Lato, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    color: rgb(29,28,29);
  }

  html .cord-component {
    /* This is very hard to override, Cord bug? */
    font-size: inherit;
  }
`;
