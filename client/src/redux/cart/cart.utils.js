/*
Utility functions allow us to
- Keep our files clean and
- Organize FUNCTIONS that we may need in multiple files in one location
*/

export const addItemToCart = (cartItems, cartItemToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToAdd.id
  ); // existingCartItem will be undefined if there are no items matching the condition

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === existingCartItem.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    ); // note: map will return a new array
  }

  return [...cartItems, { ...cartItemToAdd, quantity: 1 }]; // if `cartItemToAdd` exists in `cartItems`, add `cartItemToAdd` (with an additional property of `quantity` equal to 1) to `cartItems` and return THE NEW OBJECT
};

export const removeItemFromCart = (cartItems, cartItemToRemove) => {

  // NOTE: Unlike when we add an item to cart, when we remove an item from cart, there must be at least one existingCartItem (whose quantity to be reduced)
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  ); // existingCartItem will be undefined if there are no items matching the condition

  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== existingCartItem.id);
  }

  return cartItems.map((cartItem) =>
    cartItem.id === existingCartItem.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};
