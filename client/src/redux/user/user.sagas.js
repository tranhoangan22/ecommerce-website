/*
NOTE about the saga flow
  - first the action (that is indicative of the START of a chain of asynchronous API requests) is dispatched in the component where the user does something (eg, clicking on a button). In this case, in `sign-in.component.jsx`
  - then the Watcher Saga (that is mounted on the saga middleware, eg, through rootsaga) LISTENS (through the use of effects like `take`, `takeEvery`, `takeLatest`) for the action above (the START of the API call) and call another saga (worker saga) to make API requests and dispatch actions (through `call` effect in saga.js) asynchronously and possibly concurrently (to update Redux store)
  - Watcher Saga and Worker Saga are in saga.js, where only Watcher Saga is exported. Watcher Saga is called upon an event in the view layer in another component 
*/

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

/* Worker Sagas */

/**
 * Check if the user has confirmed their email, and update the cart after signin sucessfully when the user:
 *  - signs in (with email/password or with Google)
 *  - refreshes the page
 **/
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

      // after user sign in successfully, try to get user's cartItems from Firestore, and merge it with the existing items (could be the one the user selects before he or she sign in) and store it in Redux store
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
      userAuth && auth.signOut(); // signout from Google Auth if currently "signed in" on google
    }
  } catch (error) {
    // if the Backend API call to verify user sends back error (500)
    yield put(signInFailure(error.response.data));
    userAuth && auth.signOut(); // signout from Google Auth if currently "signed in" on google
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
  // payload === cartItems
  // making API requests -> use try/catch pattern
  try {
    // const userObject = yield auth.signInWithPopup(googleProvider); `userObject.user` is the userAuth object
    const { user } = yield auth.signInWithPopup(googleProvider); // API request. `user` is the userAuth object from `auth`

    const signInWithGoogle = true;

    // Backend API: store the user in firestore database
    yield call(createUserProfileDocument, user, signInWithGoogle); // note: `displayName` is a property in `user` (Google extracts this automatically)

    // get user's cartItems from Firestore and store it in Redux store
    yield call(verifyUserStatus, user, payload);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithEmail({ payload: { email, password, cartItems } }) {
  // making API requests -> use try/catch pattern
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password); // API request. `user` is returned if email and password are correct
    yield call(verifyUserStatus, user, cartItems);
  } catch (error) {
    yield put(signInFailure(error)); // user doesn't exist or password is not correct
  }
}

export function* checkUserAuthentication() {
  // Making API call -> use try/catch block
  try {
    const userAuth = yield call(getCurrentUser); // RETURNS A PROMISE THAT checks for (subscribes to) the changes in the user sign-in state (API request), unsubcribes immediately and RESOLVES TO THE `userAuth` OBJECT
    if (!userAuth) return; // if the user has never signed in (there's no session here), ends the function here
    yield verifyUserStatus(userAuth, []);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signOut({ payload: { currentUser, cartItems } }) {
  // Making API call -> use try/catch block
  try {
    yield updateFirestoreCart(currentUser, cartItems); // upload user's cartItems to Firestore at /carts/$(userID)
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

// Sign-up here means sign-up with user's chosen email and password
export function* signUp({ payload: { email, password, displayName } }) {
  // Making API call -> use try/catch block
  try {
    /*
      Sign-up with the `auth` library:
        - When the user sign-up / sign-in, the authentication library stores that user info (`Identifider`, `Providers`, `Created`, `Sign In`) and then assign a `UID` to it, in an object called `userAuth`
            - `userAuth` is a document in the "Authentication" collection in firestore
        - `auth.createUserWithEmailAndPassword`
            - creates a new user account associated with the specified email address and password.
            - returns a promise which resolves to an object (which has the key of `user`, ie, the `userAuth` object)
        - On successful creation of the user account, the user will also be signed in to your application.
      */
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);

    const signInWithGoogle = false;

    // Backend API: store the user in firestore database, get back the user document object in response.data
    const response = yield call(
      createUserProfileDocument,
      {
        ...user,
        displayName,
      },
      signInWithGoogle
    ); // note: adding `displayName: displayName` because `user` object doesn't have it for signin with username and password

    yield put(signUpSuccess({ email, password }));

    yield sendSignupConfirmationEmailToUser(
      response.data.displayName,
      response.data.email,
      response.data.confirmationCode
    ); // backend api call to send email to user
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

// export function* onSignUpSuccess() {
//   yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInWithEmail); // LISTENS for action of type `SIGN_OUT_START`, and fires off the worker saga to sign the user in.  NOTE: the worker saga `signInWithEmail` has access to the action -> {type, payload}
// }

/* 
Another great thing about this is that OTHER SAGAS can listen to `SIGN_OUT_START` in order to issue their own respective action (eg, clearing cart) when the user signs out.
Note: we can do this "listening for action and do sth to the redux store" in our Reducer as well. However, it is better (for resusability purpose) to do it with another action related to cart (ie, cart action) and cart saga, since we may want to have a case where we're able to clear the cart when e.g. the user clicks sth..
In other words, `SIGN_OUT_START` will be followed by `SIGN_OUT_SUCCESS` (provided the api call is successful); `SIGN_OUT_START` also triggers `CLEAR_CART` to clear the cart (see cart.sagas.js).
*/

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
