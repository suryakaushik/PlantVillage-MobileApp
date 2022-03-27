const context = 'LoginScreen';

export const login = payload => ({
  type: 'LOGIN',
  context,
  payload,
});

export const loginSuccess = payload => ({
  type: 'LOGIN_SUCCESS',
  context,
  payload,
});

export const loginFailure = payload => ({
  type: 'LOGIN_FAILURE',
  context,
  payload,
});

export const setLanguage = payload => ({
  type: 'SET_LANUGAGE',
  context,
  payload,
});

export const setLanguageSuccess = payload => ({
  type: 'SET_LANUGAGE_SUCCESS',
  context,
  payload,
});

export const setLanguageFailure = payload => ({
  type: 'SET_LANUGAGE_FAILURE',
  context,
  payload,
});
