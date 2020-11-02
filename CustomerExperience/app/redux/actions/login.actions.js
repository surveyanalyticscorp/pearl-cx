import {
  GET_LOGIN,
  GET_RESET_PASSWORD_LINK,
  UPDATE_PASSWORD,
  VALIDATE_RESET_PASSWORD_LINK,
} from './index';

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
