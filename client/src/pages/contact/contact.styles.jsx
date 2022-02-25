import styled from "styled-components";

export const ContactPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContactFormContainer = styled.form`
  margin-top: -20px;
  width: 60%;

  @media screen and (max-width: 800px) {
    width: 90%;
  }
`;

export const ContactButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const CenterContainer = styled.div`
  align-items: center;
  margin-top: 200px;
`;

export const MessageContainer = styled.h1`
  text-align: center;
`;
