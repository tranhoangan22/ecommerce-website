import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import CheckoutItem from "../../components/checkout-item/checkout-item.component.jsx";
import StripeCheckoutButton from "../../components/stripe-button/stripe-button.component.jsx";

import {
  selectCartItems,
  selectCartTotal,
} from "../../redux/cart/cart.selectors.js";

import "./checkout.styles.scss";

const CheckoutPage = ({ cartItems, cartTotal }) => (
  <div className="checkout-page">
    <div className="checkout-header">
      <div className="header-block">
        <span>Product</span>
      </div>
      <div className="header-block">
        <span>Description</span>
      </div>
      <div className="header-block">
        <span>Quantity</span>
      </div>
      <div className="header-block">
        <span>Price</span>
      </div>
      <div className="header-block">
        <span>Remove</span>
      </div>
    </div>
    {cartItems.map((cartItem) => (
      <CheckoutItem key={cartItem.id} cartItem={cartItem} />
    ))}
    {cartItems.length ? (
      <div className="total">
        <span>TOTAL: ${cartTotal}</span>
      </div>
    ) : null}
    {cartItems.length ? (
      <div className="test-warning">
        *Please use the following test credit card for payment*
        <br />
        4242 4242 4242 4242 - Exp: 01/23 - CVV: 123
      </div>
    ) : null}
    {cartItems.length ? <StripeCheckoutButton price={cartTotal} /> : null}
  </div>
);

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
  cartTotal: selectCartTotal,
});

export default connect(mapStateToProps)(CheckoutPage);

// Note about the test card: https://stripe.com/docs/testing#cards

// NOTE: `CheckoutPage` is instantiated when the user clicks on "GO TO CHECKOUT" button in `CartDropDown`
