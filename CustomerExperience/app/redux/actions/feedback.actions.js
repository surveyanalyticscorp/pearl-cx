export const GET_PANEL_MEMBER = 'GET_PANEL_MEMBER';
export const PANEL_MEMBER_RECEIVED = 'PANEL_MEMBER_RECEIVED';
export const GET_SURVEY_RESPONSE_DETAILS = 'GET_SURVEY_RESPONSE_DETAILS';
export const SURVEY_RESPONSE_DETAILS_RECEIVED =
  'SURVEY_RESPONSE_DETAILS_RECEIVED';
export const GET_RESPONSE_DETAILS_BY_RESPONSEID =
  'GET_RESPONSE_DETAILS_BY_RESPONSEID';
export const RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED =
  'RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED';
export const SET_RESPONSE_READ_LIST = 'SET_RESPONSE_READ_LIST';
export const ADD_TO_RESPONSE_READ_LIST = 'ADD_TO_RESPONSE_READ_LIST';
export const SET_ALL_RESPONSES = 'SET_ALL_RESPONSES';
export const SET_ALL_RESPONSES_EMPTY = 'SET_ALL_RESPONSES_EMPTY';

export const FETCH_ALL_RESPONSES = 'FETCH_ALL_RESPONSES';
export const FETCH_ALL_RESPONSES_RECEIVED = 'FETCH_ALL_RESPONSES_RECEIVED';

export const CLEAR_ALL_RESPONSE_DATA = 'CLEAR_ALL_RESPONSE_DATA';
export const GET_RESPONSE_TICKETS = 'GET_RESPONSE_TICKETS';
export const GET_RESPONSE_TICKETS_RECEIVED = 'GET_RESPONSE_TICKETS_RECEIVED';
export const IS_RESPONSE_LIST_LOADING = 'IS_RESPONSE_LIST_LOADING';

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

export const getResponseDetailsByResponseId = (token, param) => ({
  type: GET_RESPONSE_DETAILS_BY_RESPONSEID,
  token,
  param,
});

export const setResponseReadList = responseReadList => ({
  type: SET_RESPONSE_READ_LIST,
  responseReadList: responseReadList,
});

export const addToResponseReadList = responseSetID => ({
  type: ADD_TO_RESPONSE_READ_LIST,
  responseSetID: responseSetID,
});

export const fetchAllResponses = (token, param, onSuccess, onError) => ({
  type: FETCH_ALL_RESPONSES,
  token,
  param,
  onSuccess,
  onError,
});
export const setAllResponses = responses => ({
  type: SET_ALL_RESPONSES,
  allResponses: responses,
});

export const setAllResponsesEmpty = () => ({
  type: SET_ALL_RESPONSES_EMPTY,
});

export const isResponseLoading = isLoading => ({
  type: IS_RESPONSE_LIST_LOADING,
  isLoading: isLoading,
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
