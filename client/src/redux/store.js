import { createStore, applyMiddleware } from "redux";

import { persistStore } from "redux-persist";

import createSagaMiddleware from "redux-saga";

import logger from "redux-logger";

import rootReducer from "./root-reducer.js";
import rootSaga from "./root-saga.js";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store); // a persisted version of our Redux store
