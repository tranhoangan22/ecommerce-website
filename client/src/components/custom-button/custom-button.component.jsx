import React from "react";

// import "./custom-button.styles.scss";

import { CustomButtonContainer } from "./custom-button.styles.jsx";

export const CustomButton = ({ children, ...props }) => (
  // <CustomButtonContainer isGoogleSignIn = {props.googleSignIn} inverted = {props.inverted} > {children} </CustomButtonContainer>
  <CustomButtonContainer {...props}>{children}</CustomButtonContainer>
);


// NOTE: `CustomButton` is instantiated in the components: `SignIn`, `SignUp`, `CartDropDown`, `CollectionItem`
