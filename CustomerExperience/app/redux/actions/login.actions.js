import {
  GET_FORGOT_PSWD_OTP,
  GET_LOGIN,
  UPDATE_PASSWORD,
  VALIDATE_USER_OTP,
} from './index';

export const doLogin = param => ({
  type: GET_LOGIN,
  param,
});

export const requestOtp = param => ({
  type: GET_FORGOT_PSWD_OTP,
  param,
});

export const updatePassword = param => ({
  type: UPDATE_PASSWORD,
  param,
});

export const validateUserOtp = param => ({
  type: VALIDATE_USER_OTP,
  param,
});
