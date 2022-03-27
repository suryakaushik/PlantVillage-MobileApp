const context = 'Header';

export const logout = payload => ({
  type: 'LOGOUT',
  context,
  payload,
});

export const logoutSuccess = payload => ({
  type: 'LOGOUT_SUCCESS',
  context,
  payload,
});

export const logoutFailure = payload => ({
  type: 'LOGOUT_FAILURE',
  context,
  payload,
});