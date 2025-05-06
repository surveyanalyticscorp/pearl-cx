export const GET_DASHBOARD = 'GET_DASHBOARD';
export const DASHBOARD_RECEIVED = 'DASHBOARD_RECEIVED';
export const GET_DETRACTOR_TICKET = 'GET_DETRACTOR_TICKET';
export const DETRACTOR_TICKET_RECEIVED = 'DETRACTOR_TICKET_RECEIVED';
export const GET_CLOSED_LOOP_TICKET_DETAILS = 'GET_CLOSED_LOOP_TICKET_DETAILS';
export const CLOSED_LOOP_TICKET_DETAILS_RECEIVED =
  'CLOSED_LOOP_TICKET_DETAILS_RECEIVED';
export const CLEAR_CLOSED_LOOP_TICKET_DETAILS =
  'CLEAR_CLOSED_LOOP_TICKET_DETAILS';
export const GET_CLOSED_LOOP_SEGMENT_DETAILS =
  'GET_CLOSED_LOOP_SEGMENT_DETAILS';

export const GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS =
  'GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS';
export const FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED =
  'FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED';

export const GET_CLOSED_LOOP_OWNER_DETAILS = 'GET_CLOSED_LOOP_OWNER_DETAILS';
export const GET_CLOSED_LOOP_ALL_OWNERS_DETAILS =
  'GET_CLOSED_LOOP_ALL_OWNERS_DETAILS';

export const CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED =
  'CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED';

export const CLOSED_LOOP_OWNER_DETAILS_RECEIVED =
  'CLOSED_LOOP_OWNER_DETAILS_RECEIVED';

export const CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED =
  'CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED';
export const UPDATE_TICKET = 'UPDATE_TICKET';
export const ADD_CLOSED_LOOP_TICKET = 'ADD_CLOSED_LOOP_TICKET';

export const DASHBOARD_RANGE = 'DASHBOARD_RANGE';
export const SEGMENT_SELECTED = 'SEGMENT_SELECTED';

export const GET_CLOSED_LOOP_TICKET_LIST = 'GET_CLOSED_LOOP_TICKET_LIST';
export const CLOSED_LOOP_TICKET_LIST_RECEIVED =
  'CLOSED_LOOP_TICKET_LIST_RECEIVED';

export const GET_CLOSED_LOOP_TICKET_ITEM = 'GET_CLOSED_LOOP_TICKET_ITEM';
export const CLOSED_LOOP_TICKET_ITEM_RECEIVED =
  'CLOSED_LOOP_TICKET_ITEM_RECEIVED';

export const REMOVE_CLOSED_LOOP_TICKET_ITEM = 'REMOVE_CLOSED_LOOP_TICKET_ITEM';
export const GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS =
  'GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS';
export const CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED =
  'CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED';

export const ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS =
  'ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS';
export const ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED =
  'ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED';

export const GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY =
  'GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY';
export const CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED =
  'CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED';

export const CREATE_CLF_TICKET = 'CREATE_CLF_TICKET';
export const CREATE_CLF_TICKET_RECIEVED = 'CREATE_CLF_TICKET_RECIEVED';

export const UPDATE_CLF_TICKET = 'UPDATE_CLF_TICKET';
export const UPDATE_CLF_TICKET_RECIEVED = 'UPDATE_CLF_TICKET_RECIEVED';

export const GET_WELCOME_SCREEN_DATA = 'GET_WELCOME_SCREEN_DATA';
export const WELCOME_SCREEN_DATA_RECIEVED = 'WELCOME_SCREEN_DATA_RECIEVED';
export const SEGMENT_SELECTOR_OPEN = 'SEGMENT_SELECTOR_OPEN';

export const CLEAR_SEGEMENT_LIST = 'CLEAR_SEGEMENT_LIST';

export const APP_LOGIN_COUNTER = 'APP_LOGIN_COUNTER';
export const GET_CLF_BASE_URL = 'GET_CLF_BASE_URL';

export const GET_PARENT_COMMENT = 'GET_PARENT_COMMENT';
export const SET_PARENT_COMMENT = 'SET_PARENT_COMMENT';
export const RESET_PARENT_COMMENT = 'RESET_PARENT_COMMENT';

export const SET_FILTER_BY_STATUS_ID = 'SET_FILTER_BY_STATUS_ID';
export const SET_TOKEN_EXPIRED = 'SET_TOKEN_EXPIRED';
export const SET_TOKEN_EXPIRE_DATE = 'SET_TOKEN_EXPIRE_DATE';
export const IS_CSAT_VIEW_TOP_BOX = 'IS_CSAT_VIEW_TOP_BOX';
export const SET_MOVE_NEXT = 'SET_MOVE_NEXT';
export const CLEAR_DASHBOARD = 'CLEAR_DASHBOARD';
export const getDashboardContent = (token, param, segmentId) => ({
  type: GET_DASHBOARD,
  token,
  param,
  segmentId,
});

export const getDetractorTicketDetails = (token, param) => ({
  type: GET_CLOSED_LOOP_TICKET_DETAILS,
  token,
  param,
});

export const clearDetractorTicketDetails = () => ({
  type: CLEAR_CLOSED_LOOP_TICKET_DETAILS,
});

export const getClosedLoopSegmentDetails = (token, param) => ({
  type: GET_CLOSED_LOOP_SEGMENT_DETAILS,
  token,
  param,
});

export const getFirstTimeClosedLoopSegmentDetails = (token, param) => ({
  type: GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
  token,
  param,
});

export const getClosedLoopOwnerDetails = (token, param) => ({
  type: GET_CLOSED_LOOP_OWNER_DETAILS,
  token,
  param,
});

export const getClosedLoopAllOwnersDetails = (token, param) => ({
  type: GET_CLOSED_LOOP_ALL_OWNERS_DETAILS,
  token,
  param,
});

export const updateTicket = () => ({
  type: UPDATE_TICKET,
});

export const addTicket = () => ({
  type: ADD_CLOSED_LOOP_TICKET,
});

// CLF 3.0 APIs

export const getClosedLoopTicketList = (
  token,
  param,
  feedbackId,
  segmentId,
) => ({
  type: GET_CLOSED_LOOP_TICKET_LIST,
  token,
  param,
  feedbackId,
  segmentId,
});

export const getClosedLoopTicketItem = (token, ticketId, feedbackApiKey) => ({
  type: GET_CLOSED_LOOP_TICKET_ITEM,
  token,
  ticketId,
  feedbackApiKey,
});

export const removeTicketItemData = (token, ticketId) => ({
  type: REMOVE_CLOSED_LOOP_TICKET_ITEM,
  token,
  ticketId,
});

export const getClosedLoopTicketItemComments = (token, ticketId) => ({
  type: GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
  token,
  ticketId,
});

export const getClosedLoopTicketItemActivity = ticketId => ({
  type: GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,

  ticketId,
});

export const postAddTicketComment = (token, param, ticketId) => ({
  type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
  token,
  param,
  ticketId,
});

export const setParentComment = comment => ({
  type: SET_PARENT_COMMENT,
  parentComment: comment,
});

export const resetParentComment = () => ({
  type: RESET_PARENT_COMMENT,
});

export const createClfTicket = (param, feedbackApiKey) => ({
  type: CREATE_CLF_TICKET,

  param,
  feedbackApiKey,
});

export const resetCreateTicketResponse = () => ({
  type: CREATE_CLF_TICKET_RECIEVED,
  response: {},
});

export const updateClfTicket = (token, param, ticketId, feedbackApiKey) => ({
  type: UPDATE_CLF_TICKET,
  token,
  param,
  ticketId,
  feedbackApiKey,
});

export const getWelcomeScreenDataCount = (token, param) => ({
  type: GET_WELCOME_SCREEN_DATA,
  token,
  param,
});
export const setSegment = segment => ({
  type: SEGMENT_SELECTED,
  segment: segment,
});

export const setSegmentSelectorOpen = isOpen => ({
  type: SEGMENT_SELECTOR_OPEN,
  isOpen: isOpen,
});

export const clearSegmentList = () => ({
  type: CLEAR_SEGEMENT_LIST,
});

export const callAppLoginCounter = (token, param) => ({
  type: APP_LOGIN_COUNTER,
  token,
  param,
});

export const getCLFBaseURL = (token, param) => ({
  type: GET_CLF_BASE_URL,
  token,
  param,
});

export const setStatusIndex = currentStatusIndex => ({
  type: SET_FILTER_BY_STATUS_ID,
  currentStatusIndex,
});

export const setTokenExpired = isExpired => ({
  type: SET_TOKEN_EXPIRED,
  isTokenExpired: isExpired,
});

export const setExpirationDate = date => ({
  type: SET_TOKEN_EXPIRE_DATE,
  date: date,
});

export const toggleCsatView = isTopBoxView => ({
  type: IS_CSAT_VIEW_TOP_BOX,
  isTopBoxView: isTopBoxView,
});

export const setMoveNext = doesMoveNext => ({
  type: SET_MOVE_NEXT,
  doesMoveNext: doesMoveNext,
});

export const clearDashboard = () => ({
  type: CLEAR_DASHBOARD,
});
