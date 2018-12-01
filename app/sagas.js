import { takeLatest, fork, all } from "redux-saga/effects";
import { sessionSaga } from "./reducers/session";
import { messagesSaga } from "./reducers/messages";
import { usersSaga } from "./reducers/users";

export function* logSaga() {
  yield takeLatest("*", action => {
    if (action.type !== "SET_CURRENT_TIME") {
      console.log(action);
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(logSaga),
    fork(sessionSaga),
    fork(messagesSaga),
    fork(usersSaga)
  ]);
}

