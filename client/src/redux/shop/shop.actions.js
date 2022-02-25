import ShopActionTypes from "../shop/shop.types.js";

import {
  firestore,
  convertCollectionSnapshotToMap,
} from "../../firebase/firebase.utils";

/* receives the collections map, and create the respective action that updates the redux state "state.shop.collections" to a given `collections` (eg, one received from firestore) */
// export const updateCollections = (collections) => ({
//   type: ShopActionTypes.UPDATE_COLLECTIONS,
//   payload: collections,
// });

// function which is an action creator which creates an ACTION (an object) that, once dispached, flips the `state.shop.isFetching` to true
export const fetchCollectionsStart = () => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_START,
});

// function which is an action creator which creates an ACTION (an object) that, once dispached, flips the `state.shop.isFetching` to false (fetching is done), and updates the `state.shop.collections` to `collections`
export const fetchCollectionsSuccess = (collections) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_SUCCESS,
  payload: collections,
});

// function which is an action creator which creates an ACTION (an object) that, once dispatched, flips the `state.shop.isFetching` to false (fetching is done), and updates the `state.shop.errorMessage` to `errorMessage`
export const fetchCollectionsFailure = (errorMessage) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_FAILURE,
  payload: errorMessage,
});

/*
`redux-thunk`: REDUX BASED ASYNCHRONOUS EVENTS HANDLING:
  - all `thunk` is, is an action creator that returns a FUNCTION that receives `dispatch` and  dispatches actions asynchronously based on some logic
  - If `redux-thunk` middleware is enabled (in store.js), any time you attempt to dispatch a function (in this case `fetchCollectionsStartAsync()`) instead of an object (ie, an action), the middleware will execute that function with `dispatch` method itself as the first argument 
*/
export const fetchCollectionsStartAsync = () => (dispatch) => {
  const collectionRef = firestore.collection("collections"); // get the `collectionRef` for the collection named `collections` in firestore database (If a collection of that name doesn't exists, which it does in this case, create one)
  dispatch(fetchCollectionsStart());

  collectionRef
    .get()
    .then((collectionSnapshot) => {
      const collections = convertCollectionSnapshotToMap(collectionSnapshot);
      dispatch(fetchCollectionsSuccess(collections));
    })
    .catch((error) => dispatch(fetchCollectionsFailure(error)));
};
