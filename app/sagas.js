import { takeLatest, fork, all, put } from "redux-saga/effects";

import { sessionSaga, SIGN_OUT_SUCCEEDED } from "./reducers/session";
import { messagesSaga } from "./reducers/messages";
import { usersSaga } from "./reducers/users";
import { regionsSaga } from "./reducers/regions";
import { labelsSaga } from "./reducers/labels";

function* logAction(action) {
  if (action && action.error && action.error.response && action.error.response.data === "NO_SESSION") {
    localStorage.clear();
    yield put({ type: SIGN_OUT_SUCCEEDED });
  }
}

export function* logSaga() {
  yield takeLatest("*", logAction);
}

export default function* rootSaga() {
  yield all([
    fork(logSaga),
    fork(sessionSaga),
    fork(messagesSaga),
    fork(usersSaga),
    fork(regionsSaga),
    fork(labelsSaga)
  ]);
}
