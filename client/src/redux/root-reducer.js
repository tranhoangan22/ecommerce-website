/*
The base reducer object that represents all the states in our App
The codes that combines all the states together  
*/

// `combineReducers` turns an object whose values are different reducer functions, into a single reducer function.
// It will call every child reducer, and gather their results into a single state object, whose keys correspond to the keys of the passed reducer functions
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // use localStorage as default storage engine: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

import userReducer from "./user/user.reducer.js";
import cartReducer from "./cart/cart.reducer.js";
import directoryReducer from "./directory/directory.reducer.js";
import shopReducer from "./shop/shop.reducer.js";

const persistConfig = {
  key: "root", // at what point inside our reducer object do we want to start storing everything: we want to start from the root
  storage,
  whitelist: ["cart"], // the state that we want to persist
};

/* 
`combineReducers`: https://egghead.io/lessons/react-redux-reducer-composition-with-combinereducers 
  - Generates the rootReducer (the top-level reducer)
  - Accepts only 1 argument which is an object which specifes the mapping between the "STATE field name" and the "REDUCER managing name" 
  - The redux store `state` object will "store": `state.user`, `state.cart`, `state.directory`, `state.shop` objects
*/
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  directory: directoryReducer,
  shop: shopReducer,
  // the key `user` represents an individual slice of the entire App state -> state.user
  // -> `state.user`: is an object with the key "currentUser" (see `user.reducer.js`). `userReducer` is the reducer it should call to update `state.user`
  // -> `state.cart`: is an object wiht the key "hidden" (see `cart.reducer.js`). `cartReducer` is the reducer it should call to update `state.cart`
});

export default persistReducer(persistConfig, rootReducer); // modified version of our root reducer with persisting capability
