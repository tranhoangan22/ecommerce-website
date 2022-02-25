/* Stripe's Checkout makes it almost too easy to take people's money. This should make it even easier if you're building a react application.
	 https://github.com/azmenak/react-stripe-checkout
      -> The reason we use the `react-stripe-checkout` wrapper is because React requires a specific set of bindings that the base Stripe documentation and the Stripe code doesn't not integrate great with because it is just vanilla JS. 

   Stripe Checkout docs: https://stripe.com/docs/legacy-checkout
   STRIPE CHECKOUT SECURELY ACCEPTS YOUR CUSTOMER’S PAYMENT DETAILS AND DIRECTLY PASSES THEM TO STRIPE’S SERVER. https://dashboard.stripe.com/test/developers
    - Stripe returns a `token` object representing those payment details, which can then be submitted to YOUR SERVER for use.

   <StripeCheckout>:
   `token` (callback function) and `stripeKey` (the publishable key from Stripe account) are the only required props, everything else is optional as per the stripe docs. 
   All props go through simple validation and are passed to stripe checkout, they're also documented in StripeCheckout.js.

*/

import React from "react";
import StripeCheckout from "react-stripe-checkout"; // everything builtin for us: all the checks, all the validations on the info the the user types in when they pay
import axios from "axios"; // make post request with axios

import { connect } from "react-redux";
import { clearCart } from "../../redux/cart/cart.actions";

const StripeCheckoutButton = ({ price, clearCart }) => {
  // in order for price to be processed it has to be in cents
  const priceForStripe = price * 100;
  const publishableKey =
    "pk_test_51JX16rBdlAMyEpLg34chimKjUMbGMLhtF79ZifNRZzrP1EItMLJiriEQveJYbuBE0sXb0flhy1x8qLD5YLzfMFmC00OgrUHBo3";

  /*
  Note: `token` object is all that Stripe needs in order to create a charge
        We throw this object to the backend through an API call and the backend will handle the actual charge
  use `axios` function to make the post request with `token` to the backend at `/payment` route
  */
  const onToken = (token) => {
    const request = {
      method: "post", // it's a post request
      url: "payment", // the post request is towards "/payment". The root route is defined as the value of the `proxy` key in package.json
      // over at backend (server.js), within the post request handling at `/payment`, we expect to extract `req.body.token.id`, `req.body.amount`
      data: {
        amount: priceForStripe,
        token, // token: token,
      },
    };
    axios(request)
      .then((response) => {
        alert("Payment successful"); // for the user
        clearCart();
      })
      .catch((error) => {
        console.log("payment error: ", error); // for us developers
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

// `StripeCheckoutButton` is instantiated once in `CheckoutPage`

/*
API key: https://stripe.com/docs/keys
  - publishable key: 
      API keys are meant solely to identify your account with Stripe, they aren’t secret. 
      In other words, you can safely publish them in places like your Stripe.js JavaScript code, or in an Android or iPhone app. 
      Note: there's nothing you can really hide on Frontend!
  - secret key:
      You must keep your secret API keys confidential and only store them on your own servers. 
      You must not share your secret API key with any third parties. 
      Your account’s secret API key can perform any API request to Stripe without restriction.
*/

/*
axios APIs: https://www.npmjs.com/package/axios

    // Send a POST request
    axios({
      method: 'post',
      url: '/user/12345',
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      }
    });

*/
