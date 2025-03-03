export const GET_LOGIN = 'GET_LOGIN';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
export const AUTHENTICATE_PANEL = 'AUTHENTICATE_PANEL';
export const AUTHENTICATE_PANEL_RESPONSE = 'AUTHENTICATE_PANEL_RESPONSE';
export const UPDATE_BASE_URL = 'UPDATE_BASE_URL';
export const SET_BASE_URL = 'SET_BASE_URL';
export const SET_ACCESS_CODE = 'SET_ACCESS_CODE';
export const UPDATE_BASE_CLF_URL = 'UPDATE_BASE_CLF_URL';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_RESPONSE = 'LOGOUT_RESPONSE';
export const GET_RESET_PASSWORD_LINK = 'GET_RESET_PASSWORD_LINK';
export const RESET_PASSWORD_LINK_RESPONSE = 'RESET_PASSWORD_LINK_RESPONSE';
export const CLEAR_RESET_PASSWORD_LINK_RESPONSE =
  'CLEAR_RESET_PASSWORD_LINK_RESPONSE';

export const GET_BEARER_TOKEN = 'GET_BEARER_TOKEN';
export const GET_BEARER_TOKEN_RESPONSE = 'GET_BEARER_TOKEN_RESPONSE';

export const VALIDATE_RESET_PASSWORD_LINK = 'VALIDATE_RESET_PASSWORD_LINK';
export const VALIDATE_RESET_PASSWORD_LINK_RESPONSE =
  'VALIDATE_RESET_PASSWORD_LINK_RESPONSE';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PASSWORD_RESPONSE = 'UPDATE_PASSWORD_RESPONSE';

export const authenticatePanel = param => ({
  type: AUTHENTICATE_PANEL,
  param,
});

export const doLogin = param => ({
  type: GET_LOGIN,
  param,
});

export const getClfAuth = param => ({
  type: GET_BEARER_TOKEN,
  param,
});
export const requestPasswordLink = param => ({
  type: GET_RESET_PASSWORD_LINK,
  param,
});

export const updatePassword = param => ({
  type: UPDATE_PASSWORD,
  param,
});

export const validateResetPasswordLink = param => ({
  type: VALIDATE_RESET_PASSWORD_LINK,
  param,
});

export const setBaseUrl = baseUrl => ({
  type: SET_BASE_URL,
  baseUrl: baseUrl,
});

export const setAccessCode = accessCode => ({
  type: SET_ACCESS_CODE,
  accessCode: accessCode,
});

export const updateBaseUrl = param => ({
  type: UPDATE_BASE_URL,
  param,
});

export const updateClfBaseUrl = param => ({
  type: UPDATE_BASE_CLF_URL,
  param,
});

export const doLogout = (token, param) => ({
  type: LOGOUT,
  token,
  param,
});

export const clearResetPasswordLinkResponse = () => ({
  type: CLEAR_RESET_PASSWORD_LINK_RESPONSE,
});
