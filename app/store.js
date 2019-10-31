import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import { appReducer as app } from "./reducers/app";
import { sessionReducer as session } from "./reducers/session";
import { messagesReducer as messages } from "./reducers/messages";
import { usersReducer as users } from "./reducers/users";
import { regionsReducer as regions } from "./reducers/regions";
import { labelsReducer as labels } from "./reducers/labels";
import rootSaga from "./sagas";

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  return {
    ...createStore(
      combineReducers({
        app, session, messages, users, regions, labels
      }),
      applyMiddleware(sagaMiddleware)
    ),
    runSaga: sagaMiddleware.run(rootSaga)
  };
};

export default configureStore;
