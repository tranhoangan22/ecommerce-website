import { CartActionTypes } from "./cart.types.js";

// this action creator simply returns a payload-less action without getting any argument
// Note: we're defining payload in the returned action object because we don't need one. `payload` is an optional property in our action object
export const toggleCartHidden = () => ({
  type: CartActionTypes.TOGGLE_CART_HIDDEN,
});

// this action creator returns an action that can be dispached to add an item to `state.cart.cartItems`
export const addItem = (item) => ({
  type: CartActionTypes.ADD_ITEM,
  payload: item,
});

// this action creator returns an action that can be dispached to remove an item from `state.cart.cartItems`
export const removeItem = (item) => ({
  type: CartActionTypes.REMOVE_ITEM,
  payload: item,
});

// this action creator returns an action that can be dispached to remove a cartItem altogether from `state.cart.cartItems`
export const clearItemFromCart = (item) => ({
  type: CartActionTypes.CLEAR_ITEM_FROM_CART,
  payload: item,
});

export const clearCart = () => ({
  type: CartActionTypes.CLEAR_CART,
});

export const updateUserCartFromFirestore = (cartItems) => ({
  type: CartActionTypes.UPDATE_USER_CART_FROM_FIRESTORE,
  payload: cartItems,
});
