import { createAction, handleActions } from "redux-actions";
import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import { get } from "lodash";

/* Action Types
======================================== */
export const GET_COUNTRIES = "GET_COUNTRIES";
export const GET_COUNTRIES_REQUESTED = "GET_COUNTRIES_REQUESTED";
export const GET_COUNTRIES_SUCCEEDED = "GET_COUNTRIES_SUCCEEDED";
export const GET_COUNTRIES_FAILED = "GET_COUNTRIES_FAILED";

/* Action Creators
======================================== */
export const getCountries = createAction(GET_COUNTRIES);

/* Sagas
======================================== */
function* getCountriesSaga() {
  yield put({ type: GET_COUNTRIES_REQUESTED });

  try {
    const response = yield axios.get(
      "http://localhost:8888/api_email_simulator/countries.php",
      { withCredentials: true }
    );
    yield put({ type: GET_COUNTRIES_SUCCEEDED, countries: response.data });
  } catch (error) {
    const errorMessage = get(error, "response.data.errorMessage", "Error desconocido");
    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_LEFT
    });
    yield put({ type: GET_COUNTRIES_FAILED, error });
  }
}

/* Root Saga
======================================== */
export function* regionsSaga() {
  yield takeLatest(GET_COUNTRIES, getCountriesSaga);
}

/* Initial Reducer State
======================================== */
const initialState = {
  countries: [],
  fetchingCountries: false
};

/* Reducer
======================================== */
export const regionsReducer = handleActions({
  GET_COUNTRIES_REQUESTED: state => ({
    ...state,
    fetchingCountries: true
  }),
  GET_COUNTRIES_SUCCEEDED: (state, { countries }) => ({
    ...state,
    countries,
    fetchingCountries: false
  })
},
  initialState
);
