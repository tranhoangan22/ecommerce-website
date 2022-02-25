import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { GlobalStyle } from "./global.styles";

import Header from "./components/header/header.component";
import Spinner from "./components/spinner/spinner.component";
import ErrorBoundary from "./components/error-boundary/error-boundary.component";

import { selectCurrentUser } from "./redux/user/user.selectors";
import { checkUserSession } from "./redux/user/user.actions";

/**
 * lazy-loaded HomePage, which is now an asynchronous component => dynamic import
 */
const HomePage = lazy(() => import("./pages/homepage/homepage.component"));
const ShopPage = lazy(() => import("./pages/shop/shop.component"));
const SignInAndSignUpPage = lazy(() =>
  import("./pages/sign-in-and-sign-up/sign-in-and-sign-up.component")
);
const CheckoutPage = lazy(() => import("./pages/checkout/checkout.component"));
const WelcomePage = lazy(() => import("./pages/welcome/welcome.component"));
const ContactPage = lazy(() => import("./pages/contact/contact.component"));

const App = () => {
  /*
    useSelector
      - `useSelector` gets a selector function
      - re-run the selector whenever a value in the state that the selector points to changes
  */
  const currentUser = useSelector(selectCurrentUser);

  /*
    useDispatch
      - gives you access to the dispatch method 
    Note the Redux store/state is re-initialized on reload.
  */
  const dispatch = useDispatch(); // called only once, and thus after useEffect renders App again, it's not called anymore and no more useEffect ensue

  // Call every time after `App` renders (or rerenders, ie, when user refreshes page)
  useEffect(() => {
    dispatch(checkUserSession()); // dispatch the action CHECK_USER_SESSION that checks if there is a current user signed in, then copies this user to the redux store -> user persistence
  }, [dispatch]);

  return (
    <div>
      <GlobalStyle />
      <Header />
      <Switch>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Route exact path="/" component={HomePage} />
            <Route path="/shop" component={ShopPage} />
            <Route exact path="/checkout" component={CheckoutPage} />
            <Route
              exact
              path="/signin"
              render={() =>
                currentUser && currentUser.id ? (
                  <Redirect to="/" />
                ) : (
                  <Suspense>
                    <SignInAndSignUpPage />
                  </Suspense>
                )
              }
            />
            <Route path="/confirm/:confirmationCode" component={WelcomePage} />
            <Route path="/contact" component={ContactPage} />
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </div>
  );
};

export default App;
