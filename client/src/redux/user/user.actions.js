import UserActionTypes from "./user.types.js";

export const googleSignInStart = (cartItems) => ({
  type: UserActionTypes.GOOGLE_SIGN_IN_START,
  payload: cartItems,
});

export const emailSignInStart = (emailAndPasswordAndCartItems) => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: emailAndPasswordAndCartItems,
});

export const signInSuccess = (user) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION,
});

export const signOutStart = (userAndCart) => ({
  type: UserActionTypes.SIGN_OUT_START,
  payload: userAndCart,
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error) => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error,
});

export const signUpStart = (userCredentials) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials,
});

export const signUpSuccess = (emailAndPassword) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: emailAndPassword,
});

export const signUpFailure = (error) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error,
});

export const disableSignUpSuccessful = () => ({
  type: UserActionTypes.DISABLE_SIGN_UP_SUCCESSFUL,
});
