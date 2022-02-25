import UserActionTypes from "./user.types.js";

/*
The state mutation in your app needs to be described as a pure function that takes the previous state and the action being dispatched and returns the next state of your app.
This pure function is called the `reducer`.

A reducer is a function that gets 2 parameters:
- a state object that represents the last `state` or an initial state
- an `action` which is an object that has
	- a `type` which a string value that indicates the specific action
	- a `payload`
*/

// initial state for `state.user`
const INITIAL_STATE = {
  currentUser: null,
  error: null,
  signUpSuccessful: false,
};

// NOTE: in ES6, pass initial state (an object which is slice of the whole app state) value as a default parameter value. If `state` is not set, it is set to INITIAL_STATE
const userReducer = (state = INITIAL_STATE, action) => {
  // NOTE: every single reducer gets every single action that get fired
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
