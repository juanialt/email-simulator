import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import { get } from "lodash";
import queryString from "query-string";

import constants from "../constants";

/* Action Types
======================================== */
export const ADD_LABEL = "ADD_LABEL";
export const ADD_LABEL_REQUESTED = "ADD_LABEL_REQUESTED";
export const ADD_LABEL_SUCCEEDED = "ADD_LABEL_SUCCEEDED";
export const ADD_LABEL_FAILED = "ADD_LABEL_FAILED";

export const GET_LABELS = "GET_LABELS";
export const GET_LABELS_REQUESTED = "GET_LABELS_REQUESTED";
export const GET_LABELS_SUCCEEDED = "GET_LABELS_SUCCEEDED";
export const GET_LABELS_FAILED = "GET_LABELS_FAILED";

export const ADD_EMAIL_LABEL = "ADD_EMAIL_LABEL";
export const ADD_EMAIL_LABEL_REQUESTED = "ADD_EMAIL_LABEL_REQUESTED";
export const ADD_EMAIL_LABEL_SUCCEEDED = "ADD_EMAIL_LABEL_SUCCEEDED";
export const ADD_EMAIL_LABEL_FAILED = "ADD_EMAIL_LABEL_FAILED";

export const DELETE_LABEL = "DELETE_LABEL";
export const DELETE_LABEL_REQUESTED = "DELETE_LABEL_REQUESTED";
export const DELETE_LABEL_SUCCEEDED = "DELETE_LABEL_SUCCEEDED";
export const DELETE_LABEL_FAILED = "DELETE_LABEL_FAILED";

/* Action Creators
======================================== */
export const addLabel = createAction(ADD_LABEL);
export const getLabels = createAction(GET_LABELS);
export const addEmailLabel = createAction(ADD_EMAIL_LABEL);
export const deleteLabel = createAction(DELETE_LABEL);

/* Sagas
======================================== */

function* addLabelSaga({ payload }) {
  yield put({ type: ADD_LABEL_REQUESTED });

  const labelName = payload;
  const formData = new URLSearchParams();
  formData.append("name", labelName);

  try {
    const response = yield axios.post(
      "http://localhost:8888/api_email_simulator/labels.php",
      formData,
      { withCredentials: true }
    );

    toast.success("Etiqueta creada!", {
      position: toast.POSITION.BOTTOM_LEFT
    });

    yield put({ type: ADD_LABEL_SUCCEEDED, label: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.message", constants.DEFAULT_SERVER_ERROR_MESSAGE);
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: ADD_LABEL_FAILED, error });
  }
}

function* getLabelsSaga() {
  yield put({ type: GET_LABELS_REQUESTED });

  try {
    const response = yield axios.get(
      "http://localhost:8888/api_email_simulator/labels.php",
      { withCredentials: true }
    );

    yield put({ type: GET_LABELS_SUCCEEDED, labels: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.message", constants.DEFAULT_SERVER_ERROR_MESSAGE);
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: GET_LABELS_FAILED, error });
  }
}

function* addEmailLabelSaga({ payload }) {
  yield put({ type: ADD_EMAIL_LABEL_REQUESTED });

  const formData = new URLSearchParams();
  const { emails, selectLabels, deleteLabels } = payload;

  if (emails) {
    for (let i = 0; i < emails.length; i += 1) {
      formData.append(`emails[${i}]`, emails[i].id);
    }
  }

  if (selectLabels) {
    for (let i = 0; i < selectLabels.length; i += 1) {
      formData.append(`selectLabels[${i}]`, selectLabels[i].id);
    }
  }

  if (deleteLabels) {
    for (let i = 0; i < deleteLabels.length; i += 1) {
      formData.append(`deleteLabels[${i}]`, deleteLabels[i].id);
    }
  }

  try {
    const response = yield axios.post(
      "http://localhost:8888/api_email_simulator/labels.php",
      formData,
      { withCredentials: true }
    );

    toast.success("Etiqueta asignada!", {
      position: toast.POSITION.BOTTOM_LEFT
    });

    yield put({ type: ADD_EMAIL_LABEL_SUCCEEDED, label: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.message", constants.DEFAULT_SERVER_ERROR_MESSAGE);
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: ADD_EMAIL_LABEL_FAILED, error });
  }
}

function* deleteLabelSaga({ payload }) {
  yield put({ type: DELETE_LABEL_REQUESTED });

  try {
    yield axios.delete(
      "http://localhost:8888/api_email_simulator/labels.php",
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: queryString.stringify({ labelId: payload.labelId })
      }
    );

    toast.success("Etiqueta eliminada!", {
      position: toast.POSITION.BOTTOM_LEFT
    });

    yield put({ type: DELETE_LABEL_SUCCEEDED });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: DELETE_LABEL_FAILED, error });
  }
}

/* Root Saga
======================================== */
export function* labelsSaga() {
  yield takeLatest(ADD_LABEL, addLabelSaga);
  yield takeLatest(GET_LABELS, getLabelsSaga);
  yield takeLatest(ADD_EMAIL_LABEL, addEmailLabelSaga);
  yield takeLatest(DELETE_LABEL, deleteLabelSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  labels: [],

  fetchingLabels: false,
  fetchingLabelsError: "",

  fetchingAddLabel: false,
  fetchingAddLabelError: "",
  fetchingAddLabelSuccess: null,

  fetchingAddEmailLabel: false,
  addEmailLabelSuccess: null,

  deleteLabelSuccess: null
};

/* Reducer
======================================== */
export const labelsReducer = handleActions({
  GET_LABELS_REQUESTED: state => ({
    ...state,
    fetchingLabels: true
  }),
  GET_LABELS_SUCCEEDED: (state, { labels }) => ({
    ...state,
    fetchingLabels: false,
    labels
  }),

  ADD_LABEL_REQUESTED: state => ({
    ...state,
    fetchingAddLabel: true
  }),
  ADD_LABEL_SUCCEEDED: (state, { label }) => ({
    ...state,
    fetchingAddLabel: false,
    fetchingAddLabelSuccess: true,
    labels: [...state.labels, label]
  }),

  ADD_EMAIL_LABEL_REQUESTED: state => ({
    ...state,
    fetchingAddEmailLabel: true,
    addEmailLabelSuccess: null
  }),
  ADD_EMAIL_LABEL_SUCCEEDED: state => ({
    ...state,
    fetchingAddEmailLabel: false,
    addEmailLabelSuccess: true
  }),
  ADD_EMAIL_LABEL_FAILED: state => ({
    ...state,
    fetchingAddEmailLabel: false,
    addEmailLabelSuccess: false
  }),

  DELETE_LABEL_REQUESTED: state => ({
    ...state,
    deleteLabelSuccess: null
  }),
  DELETE_LABEL_SUCCEEDED: state => ({
    ...state,
    deleteLabelSuccess: true
  }),
  DELETE_LABEL_FAILED: state => ({
    ...state,
    deleteLabelSuccess: false
  })
}, initialState);
