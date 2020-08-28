export const GET_LOGIN = 'GET_LOGIN';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';

export const GET_FORGOT_PSWD_OTP = 'GET_FORGOT_PSWD_OTP';
export const FORGOT_PSWD_OTP_RESPONSE = 'FORGOT_PSWD_OTP_RESPONSE';

export const VALIDATE_USER_OTP = 'VALIDATE_USER_OTP';
export const VALIDATE_USER_OTP_RESPONSE = 'VALIDATE_USER_OTP_RESPONSE';

export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PASSWORD_RESPONSE = 'UPDATE_PASSWORD_RESPONSE';

export const IS_LOADING = 'IS_LOADING';
export const IS_LOGIN = 'IS_LOGIN';
export const FILL_USER_INFO = 'FILL_USER_INFO';
export const CLEAR_USER_INFO = 'CLEAR_USER_INFO';
export const API_ERROR = 'API_ERROR';
export const CLEAR_API_ERROR = 'CLEAR_API_ERROR';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';


export const showLoading = (isLoading = true) => ({
  type: IS_LOADING,
  payload: {isLoading: isLoading},
});

export const fillUserInfo = userInfo => ({
  type: FILL_USER_INFO,
  payload: {userInfo: userInfo},
});

export const clearUserInfo = () => ({
  type: CLEAR_USER_INFO,
});

export const clearError = (isLoading = true) => ({
  type: CLEAR_API_ERROR,
  payload: {isLoading: isLoading},
});

export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: {authToken: token},
});
