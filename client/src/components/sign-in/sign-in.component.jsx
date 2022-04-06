import React, { useState } from "react";
import { connect } from "react-redux";

import { FormInput } from "../form-input/form-input.component.jsx";
import { CustomButton } from "../custom-button/custom-button.component.jsx";

import { selectUserError } from "../../redux/user/user.selectors.js";
import { selectCartItems } from "../../redux/cart/cart.selectors.js";
import { createStructuredSelector } from "reselect";

import {
  googleSignInStart,
  emailSignInStart,
} from "../../redux/user/user.actions.js";

import "./sign-in.styles.scss";

const SignIn = ({
  emailSignInStart,
  googleSignInStart,
  userError,
  cartItems,
}) => {
  const [userCredentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userCredentials;

  const handleSubmit = async (event) => {
    event.preventDefault();
    emailSignInStart(email, password, cartItems);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <div className="sign-in">
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          name="email"
          type="email"
          value={email}
          handleChange={handleChange}
          label="email"
          required
        />
        <FormInput
          name="password"
          type="password"
          value={password}
          handleChange={handleChange}
          label="password"
          required
        />
        {userError && userError.in === "signin" && userError.message && (
          <div className="error-message">
            Sign-in Failure: {userError.message}
          </div>
        )}
        <div className="buttons">
          <CustomButton type="submit">Sign in</CustomButton>
          <CustomButton
            type="button"
            onClick={() => googleSignInStart(cartItems)}
            isGoogleSignIn
          >
            Sign in with Google
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  userError: selectUserError,
  cartItems: selectCartItems,
});

const mapDispatchToProps = (dispatch) => ({
  googleSignInStart: (cartItems) => dispatch(googleSignInStart(cartItems)),
  emailSignInStart: (email, password, cartItems) =>
    dispatch(emailSignInStart({ email, password, cartItems })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

// NOTE: We built the sign-in component first, because we would set up the firebase in the next section, and that's what we're going to use to handle authentication and sign-in user

// NOTE: `<CustomButton onClick={signInWithGoogle} isGoogleSignIn>` is the same as `<CustomButton onClick={signInWithGoogle} isGoogleSignIn={true}>`
