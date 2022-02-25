import React, { useState, useEffect } from "react";

import { FormInput } from "../form-input/form-input.component.jsx";
import { CustomButton } from "../custom-button/custom-button.component.jsx";

import { connect } from "react-redux";
import {
  selectUserError,
  selectSignUpSuccessful,
} from "../../redux/user/user.selectors.js";
import { createStructuredSelector } from "reselect";

import {
  signUpStart,
  disableSignUpSuccessful,
} from "../../redux/user/user.actions.js";

import "./sign-up.styles.scss";

const SignUp = ({
  signUpStart,
  userError,
  signUpSuccessful,
  disableSignUpSuccessful,
}) => {
  const [userCredentials, setCredentials] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showEmailConfirmReminder, setShowEmailConfirmReminder] =
    useState(false);

  const { displayName, email, password, confirmPassword } = userCredentials;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    signUpStart({ email, password, displayName });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...userCredentials, [name]: value });
  };

  /**
   * if sign-up is successful, prompt the user to check their email.
   * Note, `signUpSuccessful` will be changed anyway when going away and comming back to this page, so it's necessary to
   * have the if (signUpSuccessful)
   **/
  useEffect(() => {
    if (signUpSuccessful) {
      setShowEmailConfirmReminder(true);
    }
    // returned function will be called on component unmount, ie, when leaving the page
    return () => {
      if (signUpSuccessful) {
        setShowEmailConfirmReminder(false);
        disableSignUpSuccessful(); // dispatch the action to set signUpSuccessful to false when the user leaves the page, refreshes browser..
      }
    };
  }, [signUpSuccessful, disableSignUpSuccessful]); // include signUpSuccessful here to suppress a warning

  return !showEmailConfirmReminder ? (
    <div className="sign-up">
      <h2 className="title">I do not have an account</h2>
      <span>Sign up with your email and password</span>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="displayName"
          value={displayName}
          required
          handleChange={handleChange}
          label="Display Name"
        />
        <FormInput
          type="email"
          name="email"
          value={email}
          required
          handleChange={handleChange}
          label="Email"
        />
        <FormInput
          type="password"
          name="password"
          value={password}
          required
          handleChange={handleChange}
          label="Password"
        />
        <FormInput
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          required
          handleChange={handleChange}
          label="Confirm Password"
        />
        {userError && userError.in === "signup" && userError.message && (
          <div className="error-message">
            Sign-up Failure: {userError.message}
          </div>
        )}
        <CustomButton type="submit">Sign Up</CustomButton>
      </form>
    </div>
  ) : (
    <div className="sign-up sign-up-success-message">
      <h1>Thank you {displayName} for registering with us!</h1>
      <h2>
        A message with the activation link has been sent to the email {email}.
        Please confirm your email before you can sign in.
      </h2>
    </div>
  );
};

const mapStateToProp = createStructuredSelector({
  userError: selectUserError,
  signUpSuccessful: selectSignUpSuccessful,
});

const mapDispatchToProp = (dispatch) => ({
  signUpStart: (userCredentials) => dispatch(signUpStart(userCredentials)), // userCredentials === {username, password, displayName}
  disableSignUpSuccessful: () => dispatch(disableSignUpSuccessful()),
});

export default connect(mapStateToProp, mapDispatchToProp)(SignUp);
