import {FEEDBACK_UPDATED, GET_FEEDBACK, UPDATE_FEEDBACK} from './index';

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
