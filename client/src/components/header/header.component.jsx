import React from "react";
import { connect } from "react-redux"; // `connect` is a higher-order component that takes a component as argument and return a new component
import { createStructuredSelector } from "reselect";

import CartIcon from "../cart-icon/cart-icon.component.jsx";
import CartDropDown from "../cart-dropdown/cart-dropdown.component.jsx";
import {
  selectCartHidden,
  selectCartItems,
} from "../../redux/cart/cart.selectors.js";
import { selectCurrentUser } from "../../redux/user/user.selectors.js";

import { signOutStart } from "../../redux/user/user.actions.js";

import { ReactComponent as Logo } from "../../assets/crown.svg"; // The ReactComponent import name is special and tells Create React App that you want a React component that renders an SVG. https://create-react-app.dev/docs/adding-images-fonts-and-files/

// import "./header.styles.scss";

import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink,
} from "./header.styles";

// `Header` component will pull `currentUser` from Redux store and not from the `App` component which contains it. This can be done via the higher-order function `connect`.
// Similarly, `Header` component will also pull `hidden` from Redux store via `connect`
const Header = ({ currentUser, cartItems, hidden, signOutStart }) => (
  <HeaderContainer>
    {/* Wherever you render a <Link>, an anchor (<a>) will be rendered in your HTML document. */}
    <LogoContainer to="/">
      <Logo className="logo" />
    </LogoContainer>

    <OptionsContainer>
      <OptionLink to="/shop">SHOP</OptionLink>

      <OptionLink to="/contact">CONTACT</OptionLink>

      {currentUser && currentUser.id ? (
        /* as="div" means, same styles but different input component/element */
        <OptionLink
          as="div"
          onClick={() => signOutStart({ currentUser, cartItems })}
        >
          SIGN OUT
        </OptionLink>
      ) : (
        <OptionLink to="/signin">SIGN IN</OptionLink>
      )}
      <CartIcon />
    </OptionsContainer>
    {hidden ? null : <CartDropDown />}
  </HeaderContainer>
);

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  cartItems: selectCartItems,
  hidden: selectCartHidden,
});

const mapDispatchToProps = (dispatch) => ({
  signOutStart: (userAndCart) => dispatch(signOutStart(userAndCart)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header); // Subscribe the header to the states via the `currentUser` props. Header will be a container object receving state info directly from Redux store.
