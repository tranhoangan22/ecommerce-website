import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // a component that we get from "react-redux" which gives our App access to store and the reducers
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./redux/store.js";
import * as serviceWorker from "./serviceWorkerRegistration";

import "./index.css";
import App from "./App";

ReactDOM.render(
  // <Provider> gives everything inside <Provider> access to the Redux store object that we get from Redux. Makes Redux store available to the connect() calls in the component hierarchy below.
  <Provider store={store}>
    <BrowserRouter>
      {/* PersistGate delays the rendering of your app's UI until your persisted state has been retrieved (rehydrated) and saved to redux. */}
      <PersistGate persistor={persistor}>
        {/* Note that the App is a container component that subscribes to the redux store */}
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
// <BrowswerRouter> gives our app that sits in between <BrowserRouter> all the functionalities of routing that this library provides

serviceWorker.register();