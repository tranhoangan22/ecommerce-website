import React from "react";
import { useSelector, useDispatch } from "react-redux"; // so we can pass the `cartItems` state from Redux store as prop to `CartDropDown` component. The individual `item` in this prop `cartItems` will be passed down to `CartItem` component
import { useHistory } from "react-router-dom";

import { CustomButton } from "../custom-button/custom-button.component.jsx";
import CartItem from "../cart-item/cart-item.component.jsx";
import { selectCartItems } from "../../redux/cart/cart.selectors.js";
import { toggleCartHidden } from "../../redux/cart/cart.actions.js"; // bring in the toggleCartHidden action creator because we want to toggle the state.cart.hidden within our CartDropDown (when we click on checkout and go to checkout page)

import "./cart-dropdown.styles.scss";

const CartDropDown = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const history = useHistory(); // gives access to the `history` object from Router, instead of having to pass CartDropDown into the WithRouter HOC

  return (
    <div className="cart-dropdown">
      <div className="cart-items">
        {cartItems.length ? (
          cartItems.map((cartItem) => (
            <CartItem key={cartItem.id} item={cartItem} />
          ))
        ) : (
          <span className="empty-message">Your cart is empty</span>
        )}
      </div>
      {cartItems.length ? (
        <CustomButton
          onClick={() => {
            history.push("/checkout");
            dispatch(toggleCartHidden());
          }}
        >
          GO TO CHECKOUT
        </CustomButton>
      ) : (
        <CustomButton
          onClick={() => {
            history.push("/shop");
            dispatch(toggleCartHidden());
          }}
        >
          GO TO SHOP
        </CustomButton>
      )}
    </div>
  );
};

export default CartDropDown;

// NOTE: `CartDropDown` component is instantiated once in `Header` component if `state.cart.hidden` is false.
