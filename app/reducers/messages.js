import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import { get } from "lodash";
import queryString from "query-string";

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

export const GET_LABEL_MESSAGES = "GET_LABEL_MESSAGES";
export const GET_LABEL_MESSAGES_REQUESTED = "GET_LABEL_MESSAGES_REQUESTED";
export const GET_LABEL_MESSAGES_SUCCEEDED = "GET_LABEL_MESSAGES_SUCCEEDED";
export const GET_LABEL_MESSAGES_FAILED = "GET_LABEL_MESSAGES_FAILED";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const SEND_MESSAGE_REQUESTED = "SEND_MESSAGE_REQUESTED";
export const SEND_MESSAGE_SUCCEEDED = "SEND_MESSAGE_SUCCEEDED";
export const SEND_MESSAGE_FAILED = "SEND_MESSAGE_FAILED";

export const DELETE_EMAILS = "DELETE_EMAILS";
export const DELETE_EMAILS_REQUESTED = "DELETE_EMAILS_REQUESTED";
export const DELETE_EMAILS_SUCCEEDED = "DELETE_EMAILS_SUCCEEDED";
export const DELETE_EMAILS_FAILED = "DELETE_EMAILS_FAILED";

/* Action Creators
======================================== */
export const getReceivedMessages = createAction(GET_RECEIVED_MESSAGES);
export const getSentMessages = createAction(GET_SENT_MESSAGES);
export const getLabelMessages = createAction(GET_LABEL_MESSAGES);
export const sendMessage = createAction(SEND_MESSAGE);
export const deleteEmails = createAction(DELETE_EMAILS);

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

function* getLabelMessagesSaga({ payload: labelName }) {
  yield put({ type: GET_LABEL_MESSAGES_REQUESTED });

  try {
    const response = yield axios.get(
      `http://localhost:8888/api_email_simulator/messages.php?folder=${labelName}`,
      { withCredentials: true }
    );
    yield put({ type: GET_LABEL_MESSAGES_SUCCEEDED, messages: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: GET_LABEL_MESSAGES_FAILED, error });
  }
}

function* deleteEmailsSaga({ payload: emails }) {
  yield put({ type: DELETE_EMAILS_REQUESTED });

  const emailIds = emails.map(email => email.id);

  try {
    yield axios.delete(
      "http://localhost:8888/api_email_simulator/messages.php",
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: queryString.stringify(emailIds)
      }
    );

    toast.success("Emails eliminados!", {
      position: toast.POSITION.BOTTOM_LEFT
    });

    yield put({ type: DELETE_EMAILS_SUCCEEDED });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: DELETE_EMAILS_FAILED, error });
  }
}

function* sendMessageSaga({ payload }) {
  yield put({ type: SEND_MESSAGE_REQUESTED });

  const { from, to, subject, htmlCode, files } = payload;

  const formData = new FormData();
  formData.append("from", from);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("htmlCode", htmlCode);

  if (files) {
    for (let i = 0; i < files.length; i += 1) {
      formData.append(`files[${i}]`, files[i]);
    }
  }

  try {
    const response = yield axios.post(
      "http://localhost:8888/api_email_simulator/messages.php",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    toast.success("Mensaje Enviado!", {
      position: toast.POSITION.BOTTOM_LEFT
    });

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
  yield takeLatest(GET_LABEL_MESSAGES, getLabelMessagesSaga);
  yield takeLatest(SEND_MESSAGE, sendMessageSaga);
  yield takeLatest(DELETE_EMAILS, deleteEmailsSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  emails: [],
  fetchingMessages: false,

  fetchingDeleteEmails: false,
  deleteEmailsSucceeded: null
};

/* Reducer
======================================== */
export const messagesReducer = handleActions({
  GET_SENT_MESSAGES_REQUESTED: state => ({
    ...state,
    fetchingMessages: true
  }),
  GET_SENT_MESSAGES_SUCCEEDED: (state, { messages }) => ({
    ...state,
    emails: messages,
    fetchingMessages: false
  }),

  GET_RECEIVED_MESSAGES_REQUESTED: state => ({
    ...state,
    fetchingMessages: true
  }),
  GET_RECEIVED_MESSAGES_SUCCEEDED: (state, { messages }) => ({
    ...state,
    emails: messages,
    fetchingMessages: false
  }),

  GET_LABEL_MESSAGES_REQUESTED: state => ({
    ...state,
    fetchingMessages: true
  }),
  GET_LABEL_MESSAGES_SUCCEEDED: (state, { messages }) => ({
    ...state,
    emails: messages,
    fetchingMessages: false
  }),

  DELETE_EMAILS_REQUESTED: state => ({
    ...state,
    fetchingDeleteEmails: true,
    deleteEmailsSucceeded: null
  }),
  DELETE_EMAILS_SUCCEEDED: state => ({
    ...state,
    fetchingDeleteEmails: false,
    deleteEmailsSucceeded: true
  }),
  DELETE_EMAILS_FAILED: state => ({
    ...state,
    fetchingDeleteEmails: false,
    deleteEmailsSucceeded: false
  })
}, initialState);
