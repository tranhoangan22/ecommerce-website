import React from "react";

import {
  ErrorImageContainer,
  ErrorImageOverlay,
  ErrorImageText,
} from "./error-boundary.styles";

// we need access to those lifecycles methods..
class ErrorBoundary extends React.Component {
  constructor() {
    super();

    // local state letting us know whether any of the children inside the ErrorBoundary component has thrown an error
    this.state = {
      hasError: false,
    };
  }

  // executed when error occurs in any components nested in ErrorBoundary
  static getDerivedStateFromError(error) {
    // process the error
    return { hasError: true };
  }

  // have access to error and the info related to error (eg, what component throws the error)
  componentDidCatch(error, info) {
    // some side effects
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorImageOverlay>
          <ErrorImageContainer imageUrl="https://i.imgur.com/yW2W9SC.png" />
          <ErrorImageText>Sorry this page is broken</ErrorImageText>
        </ErrorImageOverlay>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
