import styled, { css } from "styled-components";

const subColor = "grey";
const mainColor = "black";

export const GroupContainer = styled.div`
  position: relative;
  margin: 45px 0;
  input[type="password"] {
    letter-spacing: 0.3em;
  }
`;

export const TextAreaContainer = styled.textarea`
  font-family: inherit; // inherit font styles from body
  resize: none; // remove the option present at the right bottom corner
  background: none;
  background-color: white;
  color: ${subColor};
  font-size: 20px;
  padding: 20px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${subColor};
  margin: 25px 0;

  &:focus {
    outline: none;
  }
`;

export const InputContainer = styled.input`
  background: none;
  background-color: white;
  color: ${subColor};
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${subColor};
  margin: 25px 0;

  &:focus {
    outline: none;
  }
`;

const shrinkLabelStyles = css`
  top: -14px;
  font-size: 12px;
  color: ${mainColor};
`;

const labelStyles = css`
  color: ${subColor};
  font-size: 16px;
  font-weight: normal;
  position: absolute; // our label elements are at the same position as (on top of) our input elements
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;

  // when user focuses (taps, clicks) onto GroupContainer (which is the parent), we add the style shrinkLabelStyles to LabelContainer
  ${GroupContainer}:focus-within & {
    ${shrinkLabelStyles}
  }
`;

/**
 * Decide which styles LabelContainer has, from the props passed to FormInputContainer, which is the props passed to FormInput.
 * Whether props.value.length is not null (user has typed in the FormInput) or null (the FormInput is empty)
 **/
const getLabelStyles = (props) =>
  props.value.length ? shrinkLabelStyles : null;

// form-input-label
export const LabelContainer = styled.label`
  ${labelStyles}
  ${getLabelStyles} // getLabelStyles function gets the argument which is the props passed to LabelContainer
`;
