import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 html {
 

}

/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #565147 orange;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #565147;
}

*::-webkit-scrollbar-thumb {
  background-color: blue;
  border-radius: 20px;
  border: 3px solid #565147;
}


  body {
    margin-bottom: 100px;
    /*font-family: Open-Sans, Helvetica, Sans-Serif;*/
    font-family: 'Dosis', sans-serif;
  }
`;

export default GlobalStyle;
