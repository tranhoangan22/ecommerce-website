// import SHOP_DATA from "./shop.data.js";

import ShopActionTypes from "../shop/shop.types.js";

/* 
This means that `state.shop`, which is a slice of the entire redux state, is an object having one property `collections`, whose initial value is SHOP_DATA
Initial state is from the shop.data.js, but once the `ShopActionTypes.UPDATE_COLLECTIONS` is dispatched, the state is updated to the data received form firestore database
*/
const INITIAL_STATE = {
  // collections: SHOP_DATA,
  collections: null,
  isFetching: false, // indicates there's a state where our app is fetching data related to `state.shop.collections`
  errorMessage: undefined, // to store the error message if fetching fails
};

const shopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ShopActionTypes.FETCH_COLLECTIONS_START:
      return {
        ...state,
        isFetching: true,
      };
    case ShopActionTypes.FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        collections: action.payload,
      };
    case ShopActionTypes.FETCH_COLLECTIONS_FAILURE:
      return {
        ...state,
        isFetch: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default shopReducer;
