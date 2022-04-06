import { takeLatest, put, all, call } from "redux-saga/effects";

import UserActionTypes from "./user.types";

import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
} from "./user.actions";

import { updateUserCartFromFirestore } from "../cart/cart.actions";

import {
  auth,
  googleProvider,
  getCurrentUser,
  updateUserCartDocument,
  readUserCartDocument,
} from "../../firebase/firebase.utils";

import {
  createUserProfileDocument,
  verifyUser,
  sendSignupConfirmationEmailToUser,
} from "../../services/api";

export function* verifyUserStatus(userAuth, existingCartItems) {
  if (!userAuth) return;

  let response;
  try {
    response = yield call(verifyUser, userAuth.uid);

    if (response.status === 200) {
      yield put(
        signInSuccess({
          id: response.data.id,
          displayName: response.data.displayName,
          email: response.data.email,
        })
      );

      try {
        const mergedCartItems = yield call(
          readUserCartDocument,
          response.data.id,
          existingCartItems
        );
        yield put(updateUserCartFromFirestore(mergedCartItems));
      } catch (err) {
        console.log("failed to update user cartItems upon signin. ", err);
      }
    } else {
      yield put(signInFailure("Could not verify user."));
      userAuth && auth.signOut();
    }
  } catch (error) {
    yield put(signInFailure(error.response.data));
    userAuth && auth.signOut();
  }
}

export function* updateFirestoreCart(currentUser, cartItems) {
  const { id } = yield currentUser;
  try {
    yield call(updateUserCartDocument, { id, cartItems });
  } catch (error) {
    yield console.log(error);
  }
}

export function* signInWithGoogle({ payload }) {
  try {
    const { user } = yield auth.signInWithPopup(googleProvider);

    const signInWithGoogle = true;

    yield call(createUserProfileDocument, user, signInWithGoogle);

    yield call(verifyUserStatus, user, payload);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithEmail({ payload: { email, password, cartItems } }) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield call(verifyUserStatus, user, cartItems);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* checkUserAuthentication() {
  try {
    const userAuth = yield call(getCurrentUser);
    if (!userAuth) return;
    yield verifyUserStatus(userAuth, []);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signOut({ payload: { currentUser, cartItems } }) {
  try {
    yield updateFirestoreCart(currentUser, cartItems);
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* signUp({ payload: { email, password, displayName } }) {
  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);

    const signInWithGoogle = false;

    const response = yield call(
      createUserProfileDocument,
      {
        ...user,
        displayName,
      },
      signInWithGoogle
    );

    yield put(signUpSuccess({ email, password }));

    yield sendSignupConfirmationEmailToUser(
      response.data.displayName,
      response.data.email,
      response.data.confirmationCode
    );
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

/* Watcher Sagas */

export function* onGoogleSignInStart() {
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle); // LISTENS for action of type `GOOGLE_SIGN_IN_START`, hence `onGoogleSignStart`, and fires off the worker saga to do respective API call
}

export function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail); // LISTENS for action of type `EMAIL_SIGN_IN_START`, and fires off the worker saga to do respective API call. NOTE: the worker saga `signInWithEmail` has access to the action -> {type, payload}
}

export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, checkUserAuthentication); // LISTENS for action of type `CHECK_USER_SESSION`, and fires off the worker saga to do respective API call
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut); // LISTENS for action of type `SIGN_OUT_START`, and fires off the worker saga to do respective API call. The SIGN_OUT_START action is passed as argument to the worker saga `signOut`
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp); // LISTENS for action of type `SIGN_OUT_START`, and fires off the worker saga to do respective API call
}

/* combining all watcher sagas for the saga middleware to run with them */
export function* userSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onSignUpStart),
  ]);
}
