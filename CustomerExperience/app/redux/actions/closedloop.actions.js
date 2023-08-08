// export const GET_DASHBOARD = 'GET_DASHBOARD';
// export const DASHBOARD_RECEIVED = 'DASHBOARD_RECEIVED';
// export const GET_DETRACTOR_TICKET = 'GET_DETRACTOR_TICKET';
// export const DETRACTOR_TICKET_RECEIVED = 'DETRACTOR_TICKET_RECEIVED';
// export const GET_CLOSED_LOOP_TICKET_DETAILS = 'GET_CLOSED_LOOP_TICKET_DETAILS';
// export const CLOSED_LOOP_TICKET_DETAILS_RECEIVED =
//   'CLOSED_LOOP_TICKET_DETAILS_RECEIVED';
// export const CLEAR_CLOSED_LOOP_TICKET_DETAILS =
//   'CLEAR_CLOSED_LOOP_TICKET_DETAILS';
// export const GET_CLOSED_LOOP_SEGMENT_DETAILS =
//   'GET_CLOSED_LOOP_SEGMENT_DETAILS';
// export const GET_CLOSED_LOOP_OWNER_DETAILS = 'GET_CLOSED_LOOP_OWNER_DETAILS';
// export const CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED =
//   'CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED';
// export const CLOSED_LOOP_OWNER_DETAILS_RECEIVED =
//   'CLOSED_LOOP_OWNER_DETAILS_RECEIVED';
// const UPDATE_TICKET = 'UPDATE_TICKET';
// const ADD_CLOSED_LOOP_TICKET = 'ADD_CLOSED_LOOP_TICKET';

// export const DASHBOARD_RANGE = 'DASHBOARD_RANGE';
// export const SEGMENT_SELECTED = 'SEGMENT_SELECTED';

// export const GET_CLOSED_LOOP_TICKET_LIST = 'GET_CLOSED_LOOP_TICKET_LIST';
// export const CLOSED_LOOP_TICKET_LIST_RECEIVED =
//   'CLOSED_LOOP_TICKET_LIST_RECEIVED';

// export const GET_CLOSED_LOOP_TICKET_ITEM = 'GET_CLOSED_LOOP_TICKET_ITEM';
// export const CLOSED_LOOP_TICKET_ITEM_RECEIVED =
//   'CLOSED_LOOP_TICKET_ITEM_RECEIVED';

// export const REMOVE_CLOSED_LOOP_TICKET_ITEM = 'REMOVE_CLOSED_LOOP_TICKET_ITEM';
// export const GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS =
//   'GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS';
// export const CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED =
//   'CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED';

// export const ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS =
//   'ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS';
// export const ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED =
//   'ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED';

// export const GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY =
//   'GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY';
// export const CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED =
//   'CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED';

// export const CREATE_CLF_TICKET = 'CREATE_CLF_TICKET';
// export const CREATE_CLF_TICKET_RECIEVED = 'CREATE_CLF_TICKET_RECIEVED';

// export const UPDATE_CLF_TICKET = 'UPDATE_CLF_TICKET';
// export const UPDATE_CLF_TICKET_RECIEVED = 'UPDATE_CLF_TICKET_RECIEVED';

// export const GET_WELCOME_SCREEN_DATA = 'GET_WELCOME_SCREEN_DATA';
// export const WELCOME_SCREEN_DATA_RECIEVED = 'WELCOME_SCREEN_DATA_RECIEVED';

export const GET_TICKET_LIST_SYNC = 'GET_TICKET_LIST_SYNC';
export const GET_TICKET_LIST_SYNC_RECEIVED = 'GET_TICKET_LIST_SYNC_RECEIVED';
export const CLEAR_TICKET_SYNC = 'CLEAR_TICKET_SYNC';
export const GET_DEFAULT_EMAIL_TEMPLATE = 'GET_DEFAULT_EMAIL_TEMPLATE';
export const GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED =
  'GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED';

export const GET_EMAIL_TEMPLATES = 'GET_EMAIL_TEMPLATES';
export const GET_EMAIL_TEMPLATES_RECEIVED = 'GET_EMAIL_TEMPLATES_RECEIVED';

export const SEND_EMAIL = 'SEND_EMAIL';
export const SEND_EMAIL_RECEIVED = 'SEND_EMAIL_RECEIVED';

export const GET_LATEST_COMMENT = 'GET_LATEST_COMMENT';
export const LATEST_COMMENT_RECEIVED = 'LATEST_COMMENT_RECEIVED';

export const GET_TICKET_STATUS_HISTORY = 'GET_TICKET_STATUS_HISTORY';
export const GET_TICKET_STATUS_HISTORY_RECEIVED =
  'GET_TICKET_STATUS_HISTORY_RECEIVED';

export const SET_TICKET_FILTER_BY_STATUS_ID = 'SET_TICKET_FILTER_BY_STATUS_ID';

export const GET_ROOT_CASUES = 'GET_ROOT_CASUES';
export const ROOT_CASUES_RECEIVED = 'ROOT_CASUES_RECEIVED';
export const GET_ACTIONS = 'GET_ACTIONS';
export const ACTIONS_RECEIVED = 'ACTIONS_RECEIVED';

export const UPDATE_ROOT_CAUSE = 'UPDATE_ROOT_CAUSE';
export const ROOT_CAUSE_UPDATE_RECEIVED = 'ROOT_CAUSE_UPDATE_RECEIVED';

export const UPDATE_TICKET_ESCALATION = 'UPDATE_TICKET_ESCALATION';
export const TICKET_ESCALATION_RECIEVED = 'TICKET_ESCALATION_RECIEVED';

export const DELETE_TICKET = 'TICKET_DELETE';
export const DELETE_TICKET_COMPLETE = 'TICKET_DELETE_COMPLETE';
export const DELETE_TICKET_STATUS_RESET = 'TICKET_DELETE_STATUS_RESET';

export const ACTION_HISTORY_SUMMARY = 'ACTION_HISTORY_SUMMARY';
export const ACTION_HISTORY_SUMMARY_RECEIVED =
  'ACTION_HISTORY_SUMMARY_RECEIVED';

export const ACTION_HISTORY_DETAILS = 'ACTION_HISTORY_DETAILS';
export const ACTION_HISTORY_DETAILS_RECEIVED =
  'ACTION_HISTORY_DETAILS_RECEIVED';

export const MEDIA_FILE_UPLOAD = 'MEDIA_FILE_UPLOAD';
export const MEDIA_FILE_UPLOAD_RESPONSE = 'MEDIA_FILE_UPLOAD_RESPONSE';
export const MEDIA_FILE_UPLOAD_RESET = 'MEDIA_FILE_UPLOAD_RESET';

export const syncTickets = (token, param, feedbackId) => ({
  type: GET_TICKET_LIST_SYNC,
  token,
  param,
  feedbackId,
});

export const clearSyncTicketStatus = () => ({
  type: CLEAR_TICKET_SYNC,
});

export const getDefaultEmailTemplate = (token, param) => ({
  type: GET_DEFAULT_EMAIL_TEMPLATE,
  token,
  param,
});

export const getEmailTemplates = (token, param) => ({
  type: GET_EMAIL_TEMPLATES,
  token,
  param,
});

export const sendEmail = (token, ticketId, param) => ({
  type: SEND_EMAIL,
  token,
  ticketId,
  param,
});

// Takes CX Ticket ID
export const getLatestComment = (token, ticketId) => ({
  type: GET_LATEST_COMMENT,
  token,
  ticketId,
});

// Takes CX Ticket ID

export const getTicketStatusHistory = (token, ticketId) => ({
  type: GET_TICKET_STATUS_HISTORY,
  token,
  ticketId,
});

export const getRootCauseList = (token, subscriberId) => ({
  type: GET_ROOT_CASUES,
  token,
  subscriberId,
});

export const getActionList = (token, subscriberId) => ({
  type: GET_ACTIONS,
  token,
  subscriberId,
});

export const updateRootCause = (token, ticketId, param, feedbackApiKey) => ({
  type: UPDATE_ROOT_CAUSE,
  token,
  ticketId,
  param,
  feedbackApiKey,
});

export const setStatusFilterById = statusId => ({
  type: SET_TICKET_FILTER_BY_STATUS_ID,
  statusId,
});

export const resetStatusId = () => ({
  type: SET_TICKET_FILTER_BY_STATUS_ID,
  statusId: '',
});

export const updateSetTicketEscalation = (
  token,
  param,
  ticketId,
  feedbackApiKey,
) => ({
  type: UPDATE_TICKET_ESCALATION,
  token,
  param,
  ticketId,
  feedbackApiKey,
});

export const deleteTickets = (token, param) => ({
  type: DELETE_TICKET,
  token,
  param,
});

export const resetDeleteTicketStatus = () => ({
  type: DELETE_TICKET_STATUS_RESET,
});

export const getActionHistorySummary = (token, ticketId) => ({
  type: ACTION_HISTORY_SUMMARY,
  token,
  ticketId,
});

export const getActionHistoryDetails = (token, ticketId) => ({
  type: ACTION_HISTORY_DETAILS,
  token,
  ticketId,
});

export const postUploadFile = param => ({
  type: MEDIA_FILE_UPLOAD,
  param,
});

export const resetUploadFilelist = param => ({
  type: MEDIA_FILE_UPLOAD_RESET,
  param,
});
