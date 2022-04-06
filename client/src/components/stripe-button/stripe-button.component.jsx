import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";

import { connect } from "react-redux";
import { clearCart } from "../../redux/cart/cart.actions";

const StripeCheckoutButton = ({ price, clearCart }) => {
  const priceForStripe = price * 100;
  const publishableKey =
    "pk_test_51JX16rBdlAMyEpLg34chimKjUMbGMLhtF79ZifNRZzrP1EItMLJiriEQveJYbuBE0sXb0flhy1x8qLD5YLzfMFmC00OgrUHBo3";

  const onToken = (token) => {
    const request = {
      method: "post",
      url: "payment",
      data: {
        amount: priceForStripe,
        token,
      },
    };
    axios(request)
      .then((response) => {
        alert("Payment successful");
        clearCart();
      })
      .catch((error) => {
        console.log("payment error: ", error);
        alert(
          "There was an issue with your payment. Please make sure you use the provided credit card."
        );
      });
  };

  return (
    <StripeCheckout
      label="Pay Now"
      name="AnTran Clothing GmbH"
      billingAddress
      shippingAddress
      image="https://svgshare.com/i/_xQ.svg"
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={onToken} // on success callback that triggers when we submit, the callback has access to the `token` object
      stripeKey={publishableKey}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(clearCart()),
});

export default connect(null, mapDispatchToProps)(StripeCheckoutButton);
