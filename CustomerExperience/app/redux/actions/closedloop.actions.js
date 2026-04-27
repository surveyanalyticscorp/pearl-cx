export const GET_TICKET_LIST_SYNC = 'GET_TICKET_LIST_SYNC';
export const GET_TICKET_LIST_SYNC_RECEIVED = 'GET_TICKET_LIST_SYNC_RECEIVED';
export const CLEAR_TICKET_SYNC = 'CLEAR_TICKET_SYNC';
export const GET_DEFAULT_EMAIL_TEMPLATE = 'GET_DEFAULT_EMAIL_TEMPLATE';
export const GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED =
  'GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED';

export const GET_EMAIL_TEMPLATES = 'GET_EMAIL_TEMPLATES';
export const GET_EMAIL_TEMPLATES_RECEIVED = 'GET_EMAIL_TEMPLATES_RECEIVED';

export const SEND_EMAIL = 'SEND_EMAIL';
export const RESET_SEND_EMAIL_RESPONSE = 'RESET_SEND_EMAIL_RESPONSE';
export const SEND_EMAIL_RECEIVED = 'SEND_EMAIL_RECEIVED';
export const SEND_EMAIL_FAILED = 'SEND_EMAIL_FAILED';
export const RESET_SEND_EMAIL_ERROR = 'RESET_SEND_EMAIL_ERROR';

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

export const CENTRALIZED_ROOT_CAUSE = 'CENTRALIZED_ROOT_CAUSE';
export const CENTRALIZED_ROOT_CAUSE_RECEIVED =
  'CENTRALIZED_ROOT_CAUSE_RECEIVED';

export const UPDATE_CENTRALIZED_ROOT_CAUSE = 'UPDATE_CENTRALIZED_ROOT_CAUSE';
export const CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED =
  'CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED';

export const ADD_DRAFT_CENTRALIZED_ROOT_CAUSE =
  'ADD_DRAFT_CENTRALIZED_ROOT_CAUSE';

export const REMOVE_DRAFT_CENTRALIZED_ROOT_CAUSE =
  'REMOVE_DRAFT_CENTRALIZED_ROOT_CAUSE';

export const RESET_DRAFT_CENTRALIZED_ROOT_CAUSE =
  'RESET_DRAFT_CENTRALIZED_ROOT_CAUSE';

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
export const GENERATE_EMAIL_DRAFT = 'GENERATE_EMAIL_DRAFT';
export const GENERATE_EMAIL_DRAFT_RECEIVED = 'GENERATE_EMAIL_DRAFT_RECEIVED';
export const GENERATE_REFINE_EMAIL_DRAFT = 'GENERATE_REFINE_EMAIL_DRAFT';
export const GENERATE_REFINE_EMAIL_DRAFT_RECEIVED =
  'GENERATE_REFINE_EMAIL_DRAFT_RECEIVED';

export const UPDATE_TAGS = 'UPDATE_TAGS';
export const UPDATE_SINGLE_TAG = 'UPDATE_SINGLE_TAG';
export const CLEAR_TAG_FILTER = 'CLEAR_TAG_FILTER';

export const GET_TAGLIST = 'GET_TAGLIST';
export const GET_TAGLIST_RECEIVED = 'GET_TAGLIST_RECEIVED';

export const REMOVE_TICKET_TAG = 'REMOVE_TICKET_TAG';
export const RESET_TICKET_TAG = 'RESET_TICKET_TAG';

export const syncTickets = ({token, param, feedbackID}) => ({
  type: GET_TICKET_LIST_SYNC,
  token,
  param,
  feedbackID,
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

export const resetSendEmailResponse = () => ({
  type: RESET_SEND_EMAIL_RESPONSE,
});

export const sendEmailFailed = () => ({
  type: SEND_EMAIL_FAILED,
});

export const resetSendEmailError = () => ({
  type: RESET_SEND_EMAIL_ERROR,
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

export const updateCentralizedRootCause = (
  ticketId,
  param,
  feedbackApiKey,
) => ({
  type: UPDATE_CENTRALIZED_ROOT_CAUSE,
  ticketId,
  param,
  feedbackApiKey,
});

export const resetCentralizedRootCause = () => ({
  type: CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED,
  response: {},
});

export const addDraftTags = (tagList, isOtherChecked, otherText) => ({
  type: ADD_DRAFT_CENTRALIZED_ROOT_CAUSE,
  tagList,
  isOtherChecked,
  otherText,
});

export const removeDraftTags = (tagList, isOtherChecked, otherText) => ({
  type: REMOVE_DRAFT_CENTRALIZED_ROOT_CAUSE,
  tagList,
  isOtherChecked,
  otherText,
});

export const resetDraftTags = () => ({
  type: RESET_DRAFT_CENTRALIZED_ROOT_CAUSE,
});

export const getCentralizedRootCause = () => ({
  type: CENTRALIZED_ROOT_CAUSE,
});

export const setStatusFilterById = statusId => ({
  type: SET_TICKET_FILTER_BY_STATUS_ID,
  statusId,
});

export const resetStatusId = () => ({
  type: SET_TICKET_FILTER_BY_STATUS_ID,
  statusId: '',
});

export const updateSetTicketEscalation = (param, ticketId, feedbackApiKey) => ({
  type: UPDATE_TICKET_ESCALATION,
  param,
  ticketId,
  feedbackApiKey,
});

export const deleteTickets = param => ({
  type: DELETE_TICKET,

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

export const generateEmailDraft = (param, ticketId, feedbackId) => ({
  type: GENERATE_EMAIL_DRAFT,
  param,
  ticketId,
  feedbackId,
});

export const generateRefineEmailDraft = param => ({
  type: GENERATE_REFINE_EMAIL_DRAFT,
  param,
});
export const getTaglist = ({feedbackId, param}) => ({
  type: GET_TAGLIST,
  feedbackId,
  param,
});

export const updateSingleTag = tag => ({
  type: UPDATE_SINGLE_TAG,
  tag,
});
export const updateTags = tags => ({
  type: UPDATE_TAGS,
  tags,
});

export const clearTagFilter = () => ({
  type: CLEAR_TAG_FILTER,
});
