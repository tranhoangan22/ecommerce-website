import { all, call, takeLatest, put } from "redux-saga/effects";

import UserActionTypes from "../user/user.types.js";
import { clearCart } from "./cart.actions.js";

export function* clearCartOnSignOut() {
  yield put(clearCart()); // `CLEAR_CART` is dispatched after `SIGN_OUT_SUCCESS` is dispatched and be listened to by `onSignOutSuccess` saga
}

// This is the second saga that listens to the action "SIGN_OUT_START"
export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

export function* cartSagas() {
  yield all([call(onSignOutStart)]);
}
