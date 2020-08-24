export const UPDATE_FEEDBACK = 'UPDATE_FEEDBACK';
export const FEEDBACK_UPDATED = 'FEEDBACK_UPDATED';
export const GET_FEEDBACK = 'GET_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';
export const SET_FEEDBACK_RANGE_FILTER = 'SET_FEEDBACK_RANGE_FILTER';


export const getFeedbackList = (param, token) => ({
  type: GET_FEEDBACK,
  param,
  token,
});

export const cleanUpdateFeedBack = () => ({
  type: FEEDBACK_UPDATED,
  response: {},
});

export const updateFeedback = (params, token) => ({
  type: UPDATE_FEEDBACK,
  params,
  token,
});

export const setFeedbackRangeFilter = range => ({
  type: SET_FEEDBACK_RANGE_FILTER,
  range,
});
