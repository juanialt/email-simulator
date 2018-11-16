import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import { appReducer as app } from "./reducers/app";
import { sessionReducer as session } from "./reducers/session";
import { messagesReducer as messages } from "./reducers/messages";
import rootSaga from "./sagas";

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  return {
    ...createStore(
        combineReducers({ app, session, messages }),
        applyMiddleware(sagaMiddleware)
    ),
    runSaga: sagaMiddleware.run(rootSaga)
  };
};

export default configureStore;
