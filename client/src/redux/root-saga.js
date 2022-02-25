/*
`all([...effects])` - parallel effects, https://redux-saga.js.org/docs/api/#alleffects---parallel-effects
Creates an Effect description that instructs the middleware to run multiple Effects IN PARALLEL (ie, CONCURRENT) and wait for all of them to complete. 
It's quite the corresponding API to standard Promise.all(promise1, promise2, ..).

*/

import { all, call } from "redux-saga/effects";

import { shopSagas } from "./shop/shop.sagas";
import { userSagas } from "./user/user.sagas";
import { cartSagas } from "./cart/cart.sagas";

export default function* rootSaga() {
  //   yield all([fetchCollectionsStart()]);
  yield all([call(shopSagas), call(userSagas), call(cartSagas)]); // NOTE that fetchCollectionStart and userSagas and WATCHER SAGAS that listens for certain actions
}
