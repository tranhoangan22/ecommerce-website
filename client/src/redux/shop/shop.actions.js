import ShopActionTypes from "../shop/shop.types.js";

import {
  firestore,
  convertCollectionSnapshotToMap,
} from "../../firebase/firebase.utils";

export const fetchCollectionsStart = () => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_START,
});

export const fetchCollectionsSuccess = (collections) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_SUCCESS,
  payload: collections,
});

export const fetchCollectionsFailure = (errorMessage) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_FAILURE,
  payload: errorMessage,
});

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
