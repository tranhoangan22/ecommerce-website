// NOTE: `CartIcon` is a CONTAINER component and connect directly to the Redux Store for the state and dispatch action

import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { toggleCartHidden } from "../../redux/cart/cart.actions.js"; // import the action creator that creates the action to toggle the cartHidden slice of the redux state: `state.cart.hidden`
import { selectCartItemsCount } from "../../redux/cart/cart.selectors.js";

import { ReactComponent as ShoppingIcon } from "../../assets/shopping-bag.svg";

import "./cart-icon.styles.scss";

const CartIcon = ({ itemCount, toggleCartHidden }) => (
  <div className="cart-icon" onClick={toggleCartHidden}>
    <ShoppingIcon className="shopping-icon" />
    <span className="item-count">{itemCount}</span>
  </div>
);

// Pulling Redux state into local component -> mapStateToProps.
// `selectCartItemsCount`, a memoized selector, will make sure `CartIcon` component is not getting rerendered when the entire Redux `state` changes but the `itemCount` are unaffected

// const mapStateToProps = (state) => ({
//   itemCount: selectCartItemsCount(state), // `selectCartItemsCount` returns `itemCount` from `state` with MEMOIZATION
// });

const mapStateToProps = createStructuredSelector({
  itemCount: selectCartItemsCount,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCartHidden: () => dispatch(toggleCartHidden()), // prop: dispatch(action) <- mapping dispatch to prop
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);

/* NOTE
If our overall state changes but the itemCount value stays the same between these changes,  redux's shallow equality check will see that itemCount is the same value 
	as last time and save us a re-render. It's still valuable to keep the logic for the reduce in a selector though 
	because we do still want to memoize the calculation of itemCount (our reduce logic), 
	and without a selector our reduce logic would still be running on every state change regardless of the final calculated value of itemCount.
*/

// NOTE: `CartIcon` is instantiated once in the component `Header`
