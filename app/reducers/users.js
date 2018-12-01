import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import { get } from "lodash";

/* Action Types
======================================== */
export const GET_USERS = "GET_USERS";
export const GET_USERS_REQUESTED = "GET_USERS_REQUESTED";
export const GET_USERS_SUCCEEDED = "GET_USERS_SUCCEEDED";
export const GET_USERS_FAILED = "GET_USERS_FAILED";

/* Action Creators
======================================== */
export const getUsers = createAction(GET_USERS);

/* Sagas
======================================== */
function* getUsersSaga() {
  yield put({ type: GET_USERS_REQUESTED });

  try {
    const response = yield axios.get(
      "http://localhost:8888/api_email_simulator/users.php",
      { withCredentials: true }
    );
    yield put({ type: GET_USERS_SUCCEEDED, users: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: GET_USERS_FAILED, error });
  }
}

/* Root Saga
======================================== */
export function* usersSaga() {
  yield takeLatest(GET_USERS, getUsersSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  users: [],
  fetchingUsers: false
};

/* Reducer
======================================== */
export const usersReducer = handleActions({
  GET_USERS_REQUESTED: state => ({
    ...state,
    fetchingUsers: true
  }),
  GET_USERS_SUCCEEDED: (state, { users }) => ({
    ...state,
    users,
    fetchingUsers: false
  })
},
  initialState
);
