import React from "react";

import "./form-input.styles.scss";

import {
  GroupContainer,
  InputContainer,
  LabelContainer,
  TextAreaContainer,
} from "./form-input.styles";

export const FormInput = ({ handleChange, label, ...otherProps }) => (
  <GroupContainer>
    {otherProps.type === "textarea" ? (
      <TextAreaContainer rows="4" onChange={handleChange} {...otherProps} />
    ) : (
      <InputContainer onChange={handleChange} {...otherProps} />
    )}

    {label ? <LabelContainer {...otherProps}>{label}</LabelContainer> : null}
  </GroupContainer>
);
