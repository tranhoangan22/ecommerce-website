import styled from "styled-components";
import { Link } from "react-router-dom";

export const WelcomePageContainer = styled.div`
  text-align: center;
`;

// "importing" styles into a custom component. returns a <Link /> with new styles.
export const ButtonContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

export const SuccessIconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 40px;
  height: 40px;
  margin: 40px auto;
`;
