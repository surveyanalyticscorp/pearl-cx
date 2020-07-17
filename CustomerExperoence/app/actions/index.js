export const GET_LOGIN = 'GET_LOGIN';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';

export const GET_FEEDBACK = 'GET_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';

export const GET_DASHBOARD = 'GET_FEEDBACK';
export const DASHBOARD_RECEIVED = 'FEEDBACK_RECEIVED';

export const IS_LOADING = 'IS_LOADING';

export const showLoading = (isLoading = true) => ({
  type: IS_LOADING,
  payload: {isLoading: isLoading},
});

export const doLogin = param => ({
  type: GET_LOGIN,
  param,
});

export const getFeedbackList = (param, token) => ({
  type: GET_FEEDBACK,
  param,
  token,
});

export const getDashboardContent = token => ({
  type: GET_DASHBOARD,
  token,
});
