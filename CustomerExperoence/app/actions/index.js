export const GET_FEEDBACK = 'GET_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';

export const getFeedbackList = () => ({
  type: GET_FEEDBACK,
  value: 1,
});

export const showLoading = (
  isLoading = true,
  message = 'Loading...',
  extraData = {},
) => ({
  type: 'INCREASE_COUNTER',
  payload: {isLoading: isLoading, message: message, extraData: extraData},
});
