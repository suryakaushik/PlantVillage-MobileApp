const context = 'RegisterScreen';

export const register = payload => ({
  type: 'REGISTER',
  context,
  payload: payload,
});

export const setLanguage = payload => ({
  type: 'SET_LANUGAGE',
  context,
  payload: payload,
});