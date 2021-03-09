import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
 html {
  position: relative;
  min-height: 100%;
}

  body {
    height: 100%;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }
`;
 
export default GlobalStyle;