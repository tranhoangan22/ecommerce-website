import { createStore, applyMiddleware } from "redux";

/* NOTE: 
the `store` 
- holds the current application store object. 
- lets you dispatch actions
- when you create store, you need to specify in the reducer how state is updated with action

`store` has 3 important methods
- getState()
- dispatch(action) -> the reducer will be called with the specified action
- subscribe(): lets you register a callback that the redux store will call any time an action has been dispatched
*/

// persist and rehydrate a redux store
import { persistStore } from "redux-persist";

/*
redux-saga
Redux side effect manager to handle asynchronous actions inside redux
*/
import createSagaMiddleware from "redux-saga";

// add middleware (what is between Action and Root Reducer) to our store so whenever actions get fired, we can catch them and display them (for testing purposes etc.)
// this middleware is function that catches the action, console.log the Redux states for us and moves it along
import logger from "redux-logger";

import rootReducer from "./root-reducer.js"; // NOTE: `rootReducer` is what is exported by default in `root-reducer.js` (what is returned by the `combineReducers` function)
import rootSaga from "./root-saga.js";

// 1. Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

/* 
Set up middleware which is expected to be an array by the store
*/
const middlewares = [sagaMiddleware];

/* 
Only apply logger in development
In Nodejs, `process.env` contains the evironment variable `process.env.NODE_ENV` that can be set by `create-react-app`,
	which allows us to know whether our app is being served in `production` or `development`.
	When we push to production (npm build..), this env variable is changed to `production`.
	When calling `npm start` and hosting it on our local server, this environment variable is set to `development.
*/
if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

// 2. mount the saga middleware (also other middlewares like logger, thunk, etc.) on the store
export const store = createStore(rootReducer, applyMiddleware(...middlewares));

// 3. Then run the saga, inside run() we pass each individual saga. Now the Saga will listens for actions and perform certain logics accordingly
sagaMiddleware.run(rootSaga);

// the persistor
export const persistor = persistStore(store); // a persisted version of our Redux store

/* 
REDUX FLOW: https://egghead.io/lessons/react-redux-react-todo-list-example-adding-a-todo
- 1. Any state change is caused by action being dispatched some where in a component
- 2. The store calls the root Reducer it was created with (with the current state and the respective action)
- 3. It matches the action type (with the switch statement)
- 4. It calls the respective child reducer 
- 5. The child reducer combine the present state with the respective changes 
- 6. The root Reducer updates state field in the global state object
- 7. The render function, which is subscribed to the store changes, renders the components with the updated state
*/

/*
Container Component vs. Representational Component:

Container components access Redux store, read the state from it, subscribe to the store, and dispatch actions from the stores using the store's top level variables
	This approach does not scale. Neither does passing the store down via props (https://egghead.io/lessons/react-redux-passing-the-store-down-explicitly-via-props).
-> There is another way using advanced React feature called "context" https://egghead.io/lessons/react-redux-passing-the-store-down-implicitly-via-context -> contradicts React`s philosophy of explicit data flow 
-> Passing the store down with <Provider> from "react-redux" (React bindings to Redux library)

Container components can be created via the `connect` function from "react-redux". Example: https://egghead.io/lessons/react-redux-generating-containers-with-connect-from-react-redux-visibletodolist
	import { connect } from "react-redux";
	const VisibleTodoList = connect(
	  mapStateToProps,
	  mapDispatchToProps
	)(TodoList);

- `ToDoList`: An example presentational component that need to be calculated from the states.
- `mapStateToProps`: Takes the state of the Redux store and and return the props for the presentational components calculated from it. These props will be updated any time the state changes.
- `mapDispatchToProps`: Takes the store dispatch method and returns the callback props needed for the presentational components.
- `VisibleTodoList`: the resulting Container component 
*/
