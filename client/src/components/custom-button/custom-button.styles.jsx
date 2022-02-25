import styled, { css } from "styled-components";

/*
`css`, A helper function to generate CSS from a template literal with interpolations. https://styled-components.com/docs/api
Returns an array of interpolations, which is a flattened data structure that you can pass as an interpolation itself.
*/

// A block of styles. The styles are conflicting with `invertedButtonStyles` -> regular styles
const buttonStyles = css`
  background-color: black;
  color: white;
  border: none;

  &:hover {
    background-color: white;
    color: black;
    border: 1px solid black;
  }
`;

// A block of styles. special styles (inverted)
const invertedButtonStyles = css`
  background-color: white;
  color: black;
  border: 1px solid black;

  @media screen and (min-width: 1100px) {
    &:hover {
      background-color: black;
      color: white;
      border: none;
    }
  }
`;

// A block of styles. special styles when button is used to sign in with google (isGoogleSignIn === true)
const googleSignInStyles = css`
  background-color: #4285f4;
  color: white;

  &:hover {
    background-color: #357ae8;
    border: none;
  }

  @media screen and (max-width: 800px) {
    font-size: 10px;
  }
`;

const getButtonStyles = (props) => {
  if (props.isGoogleSignIn) {
    return googleSignInStyles;
  }

  return props.inverted ? invertedButtonStyles : buttonStyles;
};

// In `CustomButtonContainer` we have access to the `props` that is passed in when it is instantiated!
export const CustomButtonContainer = styled.button`
  /* base styles*/
  min-width: 165px;
  width: auto;
  height: 50px;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0 35px 0 35px;
  font-size: 15px;
  text-transform: uppercase;
  font-family: "Open Sans Condensed";
  font-weight: bolder;
  cursor: pointer;

  display: flex;
  justify-content: center;

  &:active {
    transform: scale(1.1);
    transition: 0.1s;
  }

  /* the props will be checked to produce respective styles */
  ${getButtonStyles}
`;
