import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import { get } from "lodash";

/* Action Types
======================================== */
export const GET_SENT_MESSAGES = "GET_SENT_MESSAGES";
export const GET_SENT_MESSAGES_REQUESTED = "GET_SENT_MESSAGES_REQUESTED";
export const GET_SENT_MESSAGES_SUCCEEDED = "GET_SENT_MESSAGES_SUCCEEDED";
export const GET_SENT_MESSAGES_FAILED = "GET_SENT_MESSAGES_FAILED";

export const GET_RECEIVED_MESSAGES = "GET_RECEIVED_MESSAGES";
export const GET_RECEIVED_MESSAGES_REQUESTED = "GET_RECEIVED_MESSAGES_REQUESTED";
export const GET_RECEIVED_MESSAGES_SUCCEEDED = "GET_RECEIVED_MESSAGES_SUCCEEDED";
export const GET_RECEIVED_MESSAGES_FAILED = "GET_RECEIVED_MESSAGES_FAILED";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const SEND_MESSAGE_REQUESTED = "SEND_MESSAGE_REQUESTED";
export const SEND_MESSAGE_SUCCEEDED = "SEND_MESSAGE_SUCCEEDED";
export const SEND_MESSAGE_FAILED = "SEND_MESSAGE_FAILED";

/* Action Creators
======================================== */
export const getReceivedMessages = createAction(GET_RECEIVED_MESSAGES);
export const getSentMessages = createAction(GET_SENT_MESSAGES);
export const sendMessage = createAction(SEND_MESSAGE);

/* Sagas
======================================== */
function* getReceivedMessagesSaga() {
  yield put({ type: GET_RECEIVED_MESSAGES_REQUESTED });

  try {
    const response = yield axios.get(
      "http://localhost:8888/api_email_simulator/messages.php?folder=INBOX",
      { withCredentials: true }
    );
    yield put({ type: GET_RECEIVED_MESSAGES_SUCCEEDED, messages: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: GET_RECEIVED_MESSAGES_FAILED, error });
  }
}

function* getSentMessagesSaga() {
  yield put({ type: GET_SENT_MESSAGES_REQUESTED });

  try {
    const response = yield axios.get(
      "http://localhost:8888/api_email_simulator/messages.php?folder=SENT",
      { withCredentials: true }
    );
    yield put({ type: GET_SENT_MESSAGES_SUCCEEDED, messages: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: GET_SENT_MESSAGES_FAILED, error });
  }
}

function* sendMessageSaga({ payload }) {
  yield put({ type: SEND_MESSAGE_REQUESTED });

  const { from, to, subject, htmlCode } = payload;
  const formData = new URLSearchParams();
  formData.append("from", from);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("htmlCode", htmlCode);

  try {
    const response = yield axios.post(
      "http://localhost:8888/api_email_simulator/messages.php",
      formData,
      { withCredentials: true }
    );
    toast.success("Mensaje Enviado!", {
      position: toast.POSITION.BOTTOM_LEFT
    });

    window.location.replace("http://localhost:9090/new");
    yield put({ type: SEND_MESSAGE_SUCCEEDED, message: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: SEND_MESSAGE_FAILED, error });
  }
}

/* Root Saga
======================================== */
export function* messagesSaga() {
  yield takeLatest(GET_SENT_MESSAGES, getSentMessagesSaga);
  yield takeLatest(GET_RECEIVED_MESSAGES, getReceivedMessagesSaga);
  yield takeLatest(SEND_MESSAGE, sendMessageSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  emailsReceived: [],
  emailsSent: [],
  fetchingSentMessages: false,
  fetchingReceivedMessages: false
};

/* Reducer
======================================== */
export const messagesReducer = handleActions({
  GET_SENT_MESSAGES_REQUESTED: state => ({
    ...state,
    fetchingSentMessages: true
  }),
  GET_SENT_MESSAGES_SUCCEEDED: (state, { messages }) => ({
    ...state,
    emailsSent: messages,
    fetchingSentMessages: false
  }),
  GET_RECEIVED_MESSAGES_REQUESTED: state => ({
    ...state,
    fetchingReceivedMessages: true
  }),
  GET_RECEIVED_MESSAGES_SUCCEEDED: (state, { messages }) => ({
    ...state,
    emailsReceived: messages,
    fetchingReceivedMessages: false
  })
},
  initialState
);
