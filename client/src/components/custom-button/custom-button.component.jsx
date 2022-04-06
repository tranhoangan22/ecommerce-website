import React from "react";

import { CustomButtonContainer } from "./custom-button.styles.jsx";

export const CustomButton = ({ children, ...props }) => (
  <CustomButtonContainer {...props}>{children}</CustomButtonContainer>
);

// NOTE: `CustomButton` is instantiated in the components: `SignIn`, `SignUp`, `CartDropDown`, `CollectionItem`
