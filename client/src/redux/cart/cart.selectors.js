/*
Simple “selector” library for Redux (and others) 
- Selectors can compute derived data, allowing Redux to store the minimal possible state.
- Selectors are efficient. A selector is not recomputed unless one of its arguments changes.
- Selectors are composable. They can be used as input to other selectors.
*/

import { createSelector } from "reselect";

// Input selector
const selectCart = (state) => state.cart; // A function that gets the whole state and just returns a slice of it (1 layer deep)

// Output selector. Note: `createSelector()` makes `selectCartItems` a memoized selector
export const selectCartItems = createSelector(
  [selectCart], // an array of input selector objects, eg [selectCart, selectUser]
  (cart) => cart.cartItems // this function gets the argument which is the output of `selectCart` (or one of the selector objects, with the respective order)
);

// Output selector. Note: `createSelector()` makes `selectCartHidden` a memoized selector
export const selectCartHidden = createSelector(
  [selectCart],
  (cart) => cart.hidden
);

// Output selector. Note: `createSelector()` makes `selectCartItemsCount` a memoized selector
export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (
    cartItems // again, this function gets the argument which is the output of `selectCartItems`
  ) =>
    cartItems.reduce(
      (accumulatedQuantity, cartItem) =>
        accumulatedQuantity + cartItem.quantity,
      0
    )
);

// Output selector. Note: `createSelector()` makes `selectCartTotal` a memoized selector
export const selectCartTotal = createSelector(
  [selectCartItems],
  (
    cartItems // again, this function gets the argument which is the output of `selectCartItems`
  ) =>
    cartItems.reduce(
      (accumulatedTotal, cartItem) =>
        accumulatedTotal + cartItem.price * cartItem.quantity,
      0
    )
);
