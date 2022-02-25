// For explanation about saga flow: see `user.saga.js`

/* 
redux-saga. https://redux-saga.js.org/docs/About
- saga is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, 
    more efficient to execute, easy to test, and better at handling failures.
- saga uses an ES6 feature called Generators to make those asynchronous flows easy to read, write and test
- unlike redux thunk, you don't end up in callback hell, you can test your asynchronous flows easily and your actions stay pure
- saga watches for all actions and triggers API calls accordingly
*/

/* 
https://redux-saga.js.org/docs/basics/Effect
import effects from saga which allows for doing different thing 
 - creating actions
 - listening to actions

`takeEvery` allows for concurrent fetches of collections
`takeLatest` does not allow for concurrent fetches of collections
*/
import { takeLatest, call, put, all } from "redux-saga/effects";

import ShopActionTypes from "./shop.types";

import {
  firestore,
  convertCollectionSnapshotToMap,
} from "../../firebase/firebase.utils.js";

import {
  fetchCollectionsSuccess,
  fetchCollectionsFailure,
} from "./shop.actions.js";

// Worker Saga: will be fired on FETCH_COLLECTIONS_START action
export function* fetchCollectionsAsync() {
  // making API requests -> use try/catch pattern
  try {
    // HANDLING ASYNCHRONOUS EVENTS:

    const collectionRef = firestore.collection("collections"); // get the `collectionRef` for the collection named `collections` in firestore database (If a collection of that name doesn't exists, which it does in this case, create one)
    const collectionSnapshot = yield collectionRef.get(); // NOTE when a Promise is yielded to the middleware, the middleware will suspend the Saga until the Promise completes (same as Promise.then(..) pattern).

    /*
    `call(fn, ...args)`, https://redux-saga.js.org/docs/api/#callfn-args 
      - Creates an Effect description that instructs the middleware to call the function fn with args as arguments.
      - Allows us to defer control to the Saga middleware
    */
    const collections = yield call(
      convertCollectionSnapshotToMap,
      collectionSnapshot
    );
    /* 
    `put`
      - Creates an Effect description that instructs the middleware to schedule the dispatching of an action to the store.
      - This dispatch may not be immediate since other tasks might lie ahead in the saga task queue or still be in progress
    */
    yield put(fetchCollectionsSuccess(collections));
  } catch (error) {
    yield put(fetchCollectionsFailure(error.message));
  }
}

/* Watcher saga 
  LISTENS for the action of type `FETCH_COLLECTIONS_START`, starts `fetchCollectionsAsync` on each dispatched `FETCH_COLLECTIONS_START` action.
  Allows concurrent fetches of collections.
*/
export function* fetchCollectionsStart() {
  // LISTENS for the action of type `FETCH_COLLECTIONS_START`, cancel all previous actions that are still running
  yield takeLatest(
    ShopActionTypes.FETCH_COLLECTIONS_START,
    fetchCollectionsAsync // pass in a generator function
  );
}

export function* shopSagas() {
  yield all([call(fetchCollectionsStart)]);
}
