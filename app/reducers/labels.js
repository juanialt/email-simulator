import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import { get } from "lodash";
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

/* Action Creators
======================================== */
export const addLabel = createAction(ADD_LABEL);
export const getLabels = createAction(GET_LABELS);

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

/* Root Saga
======================================== */
export function* labelsSaga() {
  yield takeLatest(ADD_LABEL, addLabelSaga);
  yield takeLatest(GET_LABELS, getLabelsSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  labels: [],

  fetchingLabels: false,
  fetchingLabelsError: "",

  fetchingAddLabel: false,
  fetchingAddLabelError: ""
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
    labels: [...state.labels, label]
  })
},
  initialState
);
