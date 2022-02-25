import React, { useState, useEffect } from "react";

import { CustomButton } from "../../components/custom-button/custom-button.component";
import {
  WelcomePageContainer,
  ButtonContainer,
  SuccessIconContainer,
} from "./welcome.styles";

import { ReactComponent as SuccessIcon } from "../../assets/success.svg";

import axios from "axios";

const WelcomePage = ({ match }) => {
  const [emailConfirmed, setEmailConfirmed] = useState("");

  useEffect(() => {
    if (match.path === "/confirm/:confirmationCode") {
      axios
        .post("/api/activateuser/", {
          params: {
            confirmationCode: match.params.confirmationCode,
          },
        })
        .then((res) => {
          console.log(res);
          setEmailConfirmed("confirmed");
        })
        .catch((err) => {
          console.log(err);
          setEmailConfirmed("failed");
        });
    }
  }, [emailConfirmed]);

  if (emailConfirmed === "confirmed") {
    return (
      <WelcomePageContainer>
        <h1>Thank You!</h1>
        <p>
          Your email has been confirmed. You can now sign in and start shopping
          with us!
        </p>
        <SuccessIconContainer>
          <SuccessIcon />
        </SuccessIconContainer>
        <ButtonContainer to="/signin">
          <CustomButton>Sign in</CustomButton>
        </ButtonContainer>
      </WelcomePageContainer>
    );
  } else if (emailConfirmed === "failed") {
    return (
      <WelcomePageContainer>
        <h1>
          User not found or confirmation link has expired. Please sign up.
        </h1>
        <ButtonContainer to="/signin">
          <CustomButton> Sign Up</CustomButton>
        </ButtonContainer>
      </WelcomePageContainer>
    );
  } else {
    return <div></div>;
  }
};

export default WelcomePage;
