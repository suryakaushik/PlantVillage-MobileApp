const context = 'RegisterScreen';

export const register = payload => ({
  type: 'REGISTER',
  context,
  payload,
});

export const registerSuccess = payload => ({
  type: 'REGISTER_SUCCESS',
  context,
  payload,
});

export const registerFailure = payload => ({
  type: 'REGISTER_FAILURE',
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