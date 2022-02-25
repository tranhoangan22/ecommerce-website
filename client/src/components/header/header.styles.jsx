import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

/*
A helper function to generate CSS from a template literal with interpolations. https://styled-components.com/docs/api
Returns an array of interpolations, which is a flattened data structure that you can pass as an interpolation itself.
*/
const OptionsContainerStyles = css`
  padding: 10px 15px;
  cursor: pointer;
`;

// "importing" styles into a HTML element. returns a div with new styles.
export const HeaderContainer = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;

  @media screen and (max-width: 800px) {
    height: 60px;
    padding: 15px;
    margin-bottom: 20px;
  }
`;

// "importing" styles into a custom component. returns a <Link /> with new styles.
export const LogoContainer = styled(Link)`
  height: 100%;
  width: 70px;
  padding: 25px;
  margin-top: -20px;

  @media screen and (max-width: 800px) {
    width: 50px;
    padding: 0;
    margin-top: -8px;
  }
`;

export const OptionsContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: 800px) {
    width: 80%;
  }
`;

/*
Share styles that are duplicated. Reuse css block with the css helper function imported above. 
*/
export const OptionLink = styled(Link)`
  ${OptionsContainerStyles}
`;

export const OptionDiv = styled(Link)`
  ${OptionsContainerStyles}
`;
