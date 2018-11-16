import { createAction, handleActions } from "redux-actions";
import { placeholderUser } from "../../lib/browser-utils";

/* Action Types
======================================== */
export const MENU_CATEGORY_SELECTED = "MENU_CATEGORY_SELECTED";
export const NEW_ORDER_CATEGORY_SELECTED = "NEW_ORDER_CATEGORY_SELECTED";
export const SET_SELECTED_USER = "SET_SELECTED_USER";
export const SET_CURRENT_TIME = "SET_CURRENT_TIME";

/* Action Creators
======================================== */
export const setMenuCategorySelected = createAction(MENU_CATEGORY_SELECTED);
export const setNewOrderCategorySelected = createAction(NEW_ORDER_CATEGORY_SELECTED);
export const setUserSelected = createAction(SET_SELECTED_USER);
export const setCurrentTime = createAction(SET_CURRENT_TIME);

/* Initial Reducer State
======================================== */
const initialState = {
  categorySelected: null,
  newOrderCategorySelected: null,
  userSelected: placeholderUser(),
  currentTime: Date.now()
};

/* Reducer
======================================== */
export const appReducer = handleActions({
  MENU_CATEGORY_SELECTED: (state, action) => ({
    ...state,
    categorySelected: action.payload
  }),
  NEW_ORDER_CATEGORY_SELECTED: (state, action) => ({
    ...state,
    newOrderCategorySelected: action.payload
  }),
  SET_SELECTED_USER: (state, { payload: user }) => ({
    ...state,
    userSelected: placeholderUser(user)
  }),
  SET_CURRENT_TIME: (state, action) => ({
    ...state,
    currentTime: action.payload || Date.now()
  }),
  SIGN_OUT_SUCCEEDED: state => ({
    ...state,
    userSelected: null
  })
},
  initialState
);
