const ShopActionTypes = {
  // UPDATE_COLLECTIONS: "UPDATE_COLLECTIONS", // this action SYNCHRONOUSLY copies the data received from firestore that has been converted and update the Redux state
  FETCH_COLLECTIONS_START: "FETCH_COLLECTIONS_START",
  FETCH_COLLECTIONS_SUCCESS: "FETCH_COLLECTIONS_SUCCESS",
  FETCH_COLLECTIONS_FAILURE: "FETCH_COLLECTIONS_FAILURE",
};

export default ShopActionTypes;
