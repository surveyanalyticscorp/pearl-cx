export const IS_LOADING = 'IS_LOADING';
export const IS_LOGIN = 'IS_LOGIN';
export const FILL_USER_INFO = 'FILL_USER_INFO';
export const CLEAR_USER_INFO = 'CLEAR_USER_INFO';
export const API_ERROR = 'API_ERROR';
export const IS_ERROR = 'IS_ERROR';
export const CLEAR_API_ERROR = 'CLEAR_API_ERROR';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_RANGE_FILTER = 'SET_RANGE_FILTER';
export const SET_USER_DETAILS_FOR_RESET_PASSWORD = 'SET_USER_DETAILS_FOR_RESET_PASSWORD';
export const SET_DYNAMIC_LINK = 'SET_DYNAMIC_LINK';
export const WANT_TO_RELOAD_DASHBOARD = 'WANT_TO_RELOAD_DASHBOARD';

export const showLoading = (isLoading = true) => ({
  type: IS_LOADING,
  payload: {isLoading: isLoading},
});

export const wantToReloadDashboard = (wantToReload) => ({
    type: WANT_TO_RELOAD_DASHBOARD,
    payload: {wantToReload: wantToReload},
});

export const fillUserInfo = userInfo => ({
  type: FILL_USER_INFO,
  payload: {userInfo: userInfo},
});

export const clearUserInfo = () => ({
  type: CLEAR_USER_INFO,
  payload: {}
});

export const clearError = (isLoading = true) => ({
  type: CLEAR_API_ERROR,
  payload: {isLoading: isLoading},
});

export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: {authToken: token},
});

export const setRangeFilter = range => ({
  type: SET_RANGE_FILTER,
  range,
});

export const setError = (error) => ({
  type: API_ERROR,
  error
});

export const setUserDetailsForResetPassword = (body) => ({
  type: SET_USER_DETAILS_FOR_RESET_PASSWORD,
  payload: body,
});

export const setDynamicLink = (link) => ({
  type: SET_DYNAMIC_LINK,
  payload: link
});
