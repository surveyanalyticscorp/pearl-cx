export const GET_PANEL_MEMBER = 'GET_PANEL_MEMBER';
export const PANEL_MEMBER_RECEIVED = 'PANEL_MEMBER_RECEIVED';
export const GET_SURVEY_RESPONSE_DETAILS = 'GET_SURVEY_RESPONSE_DETAILS';
export const SURVEY_RESPONSE_DETAILS_RECEIVED =
  'SURVEY_RESPONSE_DETAILS_RECEIVED';

export const CLEAR_ALL_RESPONSE_DATA = 'CLEAR_ALL_RESPONSE_DATA';
export const GET_RESPONSE_TICKETS = 'GET_RESPONSE_TICKETS';
export const GET_RESPONSE_TICKETS_RECEIVED = 'GET_RESPONSE_TICKETS_RECEIVED';

export const getPanelMemberDetails = (token, param) => ({
  type: GET_PANEL_MEMBER,
  param,
  token,
});

export const getSurveyResponseDetails = (token, param) => ({
  type: GET_SURVEY_RESPONSE_DETAILS,
  param,
  token,
});

export const getResponseTickets = (token, feedbackId, responseId, param) => ({
  type: GET_RESPONSE_TICKETS,
  token,
  feedbackId,
  responseId,
  param,
});

export const clearResponseData = () => ({
  type: CLEAR_ALL_RESPONSE_DATA,
});

//
// export const cleanUpdateFeedBack = () => ({
//   type: FEEDBACK_UPDATED,
//   response: {},
// });
//
// export const updateFeedback = (params, token) => ({
//   type: UPDATE_FEEDBACK,
//   params,
//   token,
// });
