export const signout = payload => ({
  type: "API_SIGNOUT_REQUEST",
  payload
});

export const selectUser = payload => ({
  type: "SET_SELECTED_USER",
  payload
});
