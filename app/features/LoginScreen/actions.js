const context = 'LoginScreen';

export const login = payload => ({
  type: 'LOGIN',
  context,
  payload: payload,
});

export const setLanguage = payload => ({
  type: 'SET_LANUGAGE',
  context,
  payload: payload,
});