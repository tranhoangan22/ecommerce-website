import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
   body {
     font-family: "Open Sans Condensed";
     /* 20px top and bottom, 80px on the side */
     padding: 20px 60px;

     @media screen and (max-width: 800px) {
	      padding: 10px; 
     }
   }
   
   /* override default behavior of the a tags that <Link> generates */
   a {
     text-decoration: none;
     color: black;
   }

   ${'' /* h1 {
     @media screen and (max-width: 800px) {
       text-align: center;
     }
   } */}

   /* get rid of the default padding/margin */
   * {
     box-sizing: border-box;
   }

`;
