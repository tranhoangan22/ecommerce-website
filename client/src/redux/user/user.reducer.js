import UserActionTypes from "./user.types.js";

const INITIAL_STATE = {
  currentUser: null,
  error: null,
  signUpSuccessful: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpSuccessful: true,
      };
    case UserActionTypes.DISABLE_SIGN_UP_SUCCESSFUL:
      return {
        ...state,
        signUpSuccessful: false,
      };
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        error: null,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        currentUser: null,
        error: { ...action.payload, in: "signin" },
      };
    case UserActionTypes.SIGN_OUT_FAILURE:
      return {
        ...state,
        error: { ...action.payload },
      };
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: { ...action.payload, in: "signup" },
      };
    default:
      return state;
  }
};

export default userReducer;

/*
NOTE: the reducer need not to listen to all the actions. In fact, this is why you don't specify actions like CHECK_USER_ACTION, SIGN_UP_SUCCESS, etc. here
*/
