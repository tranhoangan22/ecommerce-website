import { all, call, takeLatest, put } from "redux-saga/effects";

import UserActionTypes from "../user/user.types.js";
import { clearCart } from "./cart.actions.js";

export function* clearCartOnSignOut() {
  yield put(clearCart());
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

export function* cartSagas() {
  yield all([call(onSignOutStart)]);
}
