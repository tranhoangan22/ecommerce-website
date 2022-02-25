import { createSelector } from "reselect";

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser // this function gets the argument which is the ouput of `selectUser`
);

export const selectUserError = createSelector(
  [selectUser],
  (user) => user.error
);

export const selectSignUpSuccessful = createSelector(
  [selectUser],
  (user) => user.signUpSuccessful
);
