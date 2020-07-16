export const GET_FEEDBACK = 'GET_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';

export const getFeedbackList = (param, token) => ({
  type: GET_FEEDBACK,
  param,
  token,
});

export const showLoading = (
  isLoading = true,
  message = 'Loading...',
  extraData = {},
) => ({
  type: 'INCREASE_COUNTER',
  payload: {isLoading: isLoading, message: message, extraData: extraData},
});
