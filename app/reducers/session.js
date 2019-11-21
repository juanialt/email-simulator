import { put, takeLatest } from "redux-saga/effects";
import { createAction, handleActions } from "redux-actions";
import axios from "axios";
import { toast } from "react-toastify";
import { get } from "lodash";

import { placeholderAuth } from "../../lib/browser-utils";

/* Action Types
======================================== */
export const REGISTER = "REGISTER";
export const REGISTER_REQUESTED = "REGISTER_REQUESTED";
export const REGISTER_SUCCEEDED = "REGISTER_SUCCEEDED";
export const REGISTER_FAILED = "REGISTER_FAILED";

export const SIGN_IN = "SIGN_IN";
export const SIGN_IN_REQUESTED = "SIGN_IN_REQUESTED";
export const SIGN_IN_SUCCEEDED = "SIGN_IN_SUCCEEDED";
export const SIGN_IN_FAILED = "SIGN_IN_FAILED";

export const SIGN_OUT = "SIGN_OUT";
export const SIGN_OUT_REQUESTED = "SIGN_OUT_REQUESTED";
export const SIGN_OUT_SUCCEEDED = "SIGN_OUT_SUCCEEDED";
export const SIGN_OUT_FAILED = "SIGN_OUT_FAILED";

/* Action Creators
======================================== */
export const register = createAction(REGISTER);
export const signIn = createAction(SIGN_IN);
export const signOut = createAction(SIGN_OUT);

/* Sagas
======================================== */
function* registerSaga({ payload }) {
  const {
    username,
    name,
    lastName,
    address,
    phone,
    countryId,
    stateId,
    city,
    email,
    password
  } = payload;

  yield put({ type: REGISTER_REQUESTED });

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("lastName", lastName);
  formData.append("address", address);
  formData.append("phone", phone);
  formData.append("countryId", countryId);
  formData.append("stateId", stateId);
  formData.append("city", city);
  formData.append("email", email);
  formData.append("password", password);

  try {
    const response = yield axios.post(
      "http://localhost:8888/api_email_simulator/register.php",
      formData,
      { withCredentials: true }
    );

    yield put({ type: REGISTER_SUCCEEDED, user: response });
  } catch (error) {
    const errorMessage = get(error, "response.data.message", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: REGISTER_FAILED, error });
  }
}

function* signinSaga({ payload }) {
  const { username, password } = payload;

  yield put({ type: SIGN_IN_REQUESTED });

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = yield axios.post(
      "http://localhost:8888/api_email_simulator/login.php",
      formData,
      { withCredentials: true }
    );

    localStorage.setItem("user", JSON.stringify(response.data));

    yield put({ type: SIGN_IN_SUCCEEDED, user: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.message", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: SIGN_IN_FAILED, error });
  }
}

function* signoutSaga() {
  yield put({ type: SIGN_OUT_REQUESTED });
  try {
    yield axios.post("http://localhost:8888/api_email_simulator/logout.php");
    localStorage.clear(); // Clear all Local Storage Data
    yield put({ type: SIGN_OUT_SUCCEEDED });
  } catch (error) {
    yield put({ type: SIGN_OUT_FAILED, error });
  }
}


/* Root Saga
======================================== */
export function* sessionSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(SIGN_IN, signinSaga);
  yield takeLatest(SIGN_OUT, signoutSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  registerFetching: false,
  registerSucceeded: null,
  registerError: null,

  user: placeholderAuth(),
  userFetching: false,
  userError: null,

  signoutFetching: false,
  signoutError: null
};

/* Reducer
======================================== */
export const sessionReducer = handleActions({
  REGISTER_REQUESTED: state => ({
    ...state,
    registerFetching: true,
    registerSucceeded: null
  }),
  REGISTER_SUCCEEDED: state => ({
    ...state,
    registerFetching: false,
    registerSucceeded: true
  }),
  REGISTER_FAILED: (state, { error }) => ({
    ...state,
    registerFetching: false,
    registerSucceeded: false,
    registerError: error
  }),

  SIGN_IN_REQUESTED: state => ({
    ...state,
    userFetching: true
  }),
  SIGN_IN_SUCCEEDED: (state, { user }) => ({
    ...state,
    userFetching: false,
    user
  }),
  SIGN_IN_FAILED: (state, { error }) => ({
    ...state,
    userFetching: false,
    userError: error
  }),

  SIGN_OUT_REQUESTED: state => ({
    ...state,
    signoutFetching: true
  }),
  SIGN_OUT_SUCCEEDED: state => ({
    ...state,
    signoutFetching: false,
    user: null
  }),
  SIGN_OUT_FAILED: (state, { error }) => ({
    ...state,
    signoutFetching: false,
    signoutError: error
  })
}, initialState);
