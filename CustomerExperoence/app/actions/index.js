export const GET_LOGIN = 'GET_LOGIN';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';

export const GET_FEEDBACK = 'GET_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';

export const GET_DASHBOARD = 'GET_FEEDBACK';
export const DASHBOARD_RECEIVED = 'DASHBOARD_RECEIVED';

export const GET_DETRACTOR_TICKET = 'GET_DETRACTOR_TICKET';
export const DETRACTOR_TICKET_RECEIVED = 'DETRACTOR_TICKET_RECEIVED';

export const IS_LOADING = 'IS_LOADING';
export const IS_LOGIN = 'IS_LOGIN';
export const FILL_USER_INFO = 'FILL_USER_INFO';
export const API_ERROR = 'API_ERROR';
export const CLEAR_API_ERROR = 'CLEAR_API_ERROR';

export const UPDATE_FEEDBACK = 'UPDATE_FEEDBACK';
export const FEEDBACK_UPDATED = 'FEEDBACK_UPDATED';
export const showLoading = (isLoading = true) => ({
  type: IS_LOADING,
  payload: {isLoading: isLoading},
});

export const setIsLogin = isLogin => ({
  type: IS_LOGIN,
  payload: {isLogin: isLogin},
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

export const cleanUpdateFeedBack = () => ({
  type: FEEDBACK_UPDATED,
  response: {},
});

export const getDashboardContent = token => ({
  type: GET_DASHBOARD,
  token,
});

export const getDetractorContent = (param, token) => ({
  type: GET_DETRACTOR_TICKET,
  param,
  token,
})

export const fillUserInfo = userInfo => ({
  type: FILL_USER_INFO,
  payload: {userInfo: userInfo},
});

export const updateFeedback = (params, token) => ({
  type: UPDATE_FEEDBACK,
  params,
  token,
});
export const clearError = (isLoading = true) => ({
  type: CLEAR_API_ERROR,
  payload: {isLoading: isLoading},
});
