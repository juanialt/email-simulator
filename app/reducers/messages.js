import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";

/* Action Types
======================================== */
export const GET_INBOX = "GET_INBOX";
export const GET_INBOX_REQUESTED = "GET_INBOX_REQUESTED";
export const GET_INBOX_SUCCEEDED = "GET_INBOX_SUCCEEDED";
export const GET_INBOX_FAILED = "GET_INBOX_FAILED";

/* Action Creators
======================================== */
export const getInbox = createAction(GET_INBOX);

/* Sagas
======================================== */
function* getInboxSaga() {
  yield put({ type: GET_INBOX_REQUESTED });

  try {
    const response = yield axios.get("http://localhost:8888/api_email_simulator/messages.php");
    yield put({ type: GET_INBOX_SUCCEEDED, payload: response });
  } catch (error) {
    const errorMessage = error.response.data.errorMessage || "Error desconocido";
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
    yield put({ type: GET_INBOX_FAILED, error });
  }
}

/* Root Saga
======================================== */
export function* messagesSaga() {
  yield takeLatest(GET_INBOX, getInboxSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  inbox: null,
  fetchingInbox: false
};

/* Reducer
======================================== */
export const messagesReducer = handleActions({
  GET_INBOX_REQUESTED: state => ({
    ...state,
    fetchingInbox: true
  }),
  GET_INBOX_SUCCEEDED: (state, action) => ({
    ...state,
    inbox: action.response,
    fetchingInbox: false
  })
},
  initialState
);
