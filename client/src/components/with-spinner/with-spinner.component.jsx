/* 
`WithSpinner` is a high order component (HOC) which takes any component `WrappedComponent` and returns another component with "spinner loading" functionality.
It is a function that takes in `WrappedComponent`. The resulting `WithSpinner(WrappedComponent)` takes in `isLoading` and returns:
	- a component with a functionalities of the "spinner loading" feature (ie, <SpinnerOverlay><SpinnerContainer/><SpinnerOverlay/>), or
	- the `WrappedComponent` having the props (ie, `otherProps`) being all the props available to the component `WithSpinner(WrappedComponent)`
*/

import React from "react";

import Spinner from "../spinner/spinner.component";

const WithSpinner =
  (WrappedComponent) =>
  ({ isLoading, ...otherProps }) => {
    return isLoading ? <Spinner /> : <WrappedComponent {...otherProps} />;
  };

export default WithSpinner;

// NOTE: another familiar HOC is `withRouter` from "react-router-dom" library
