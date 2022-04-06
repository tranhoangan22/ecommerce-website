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
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
