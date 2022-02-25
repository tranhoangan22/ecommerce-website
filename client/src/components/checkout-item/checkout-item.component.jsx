import React from "react";
import { connect } from "react-redux";

import {
  clearItemFromCart,
  addItem,
  removeItem,
} from "../../redux/cart/cart.actions.js"; // import the action creators

import "./checkout-item.styles.scss";

// const CheckoutItem = ({ cartItem: { name, imageUrl, price, quantity } }) => ( // we won't have access to `cartItem` property doing this
const CheckoutItem = ({ cartItem, clearItem, addItem, removeItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <div className="checkout-item">
      {/* The reason we use container for image is because it is easier for us to control the size of the section holding the image */}
      <div className="image-container">
        <img src={imageUrl} alt="item" />
      </div>
      <span className="name">{name}</span>
      <span className="quantity">
        <div className="arrow" onClick={() => removeItem(cartItem)}>&#10094;</div>
        <span className="value">{quantity}</span>
        <div className="arrow" onClick={() => addItem(cartItem)}>&#10095;</div>
      </span>
      <span className="price">{price}</span>
      <div className="remove-button" onClick={() => clearItem(cartItem)}>
        &#10005;
      </div>
    </div>
  );
};

// a prop with the name `clearItem` is passed to `CheckoutItem`, this prop is a function, which for a specific item (which it gets `cartItem` as an argument) dispatches an action to remove it altogether from `state.cart.cartItems`
const mapDispatchToProps = (dispatch) => ({
  clearItem: (item) => dispatch(clearItemFromCart(item)),
  addItem: (item) => dispatch(addItem(item)),
  removeItem: (item) => dispatch(removeItem(item)),
});

export default connect(null, mapDispatchToProps)(CheckoutItem);

// UTF-8 Windings: https://www.w3schools.com/charsets/ref_utf_dingbats.asp

// NOTE: `CheckoutItem` will be instantiated in `CheckoutPage`, for each of the available cartItem in `state.cart.cartItems`
