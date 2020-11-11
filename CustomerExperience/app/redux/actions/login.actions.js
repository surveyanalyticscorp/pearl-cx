export const GET_LOGIN = 'GET_LOGIN';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_RESPONSE = 'LOGOUT_RESPONSE';
export const GET_RESET_PASSWORD_LINK = 'GET_RESET_PASSWORD_LINK';
export const VALIDATE_RESET_PASSWORD_LINK = 'VALIDATE_RESET_PASSWORD_LINK';
export const VALIDATE_RESET_PASSWORD_LINK_RESPONSE = 'VALIDATE_RESET_PASSWORD_LINK_RESPONSE';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PASSWORD_RESPONSE = 'UPDATE_PASSWORD_RESPONSE';

export const doLogin = param => ({
  type: GET_LOGIN,
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

export const doLogout = param => ({
  type: LOGOUT,
  param,
});
