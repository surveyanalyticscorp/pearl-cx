export const GET_DASHBOARD = 'GET_DASHBOARD';
export const DASHBOARD_RECEIVED = 'DASHBOARD_RECEIVED';
export const GET_DETRACTOR_TICKET = 'GET_DETRACTOR_TICKET';
export const DETRACTOR_TICKET_RECEIVED = 'DETRACTOR_TICKET_RECEIVED';
export const GET_CLOSED_LOOP_TICKET_DETAILS = 'GET_CLOSED_LOOP_TICKET_DETAILS';
export const CLOSED_LOOP_TICKET_DETAILS_RECEIVED = 'CLOSED_LOOP_TICKET_DETAILS_RECEIVED';
export const CLEAR_CLOSED_LOOP_TICKET_DETAILS = 'CLEAR_CLOSED_LOOP_TICKET_DETAILS';
export const GET_CLOSED_LOOP_SEGMENT_DETAILS = 'GET_CLOSED_LOOP_SEGMENT_DETAILS';
export const GET_CLOSED_LOOP_OWNER_DETAILS = 'GET_CLOSED_LOOP_OWNER_DETAILS';
export const CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED = 'CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED';
export const CLOSED_LOOP_OWNER_DETAILS_RECEIVED = 'CLOSED_LOOP_OWNER_DETAILS_RECEIVED';
const UPDATE_TICKET = 'UPDATE_TICKET';
const ADD_CLOSED_LOOP_TICKET = 'ADD_CLOSED_LOOP_TICKET';

export const DASHBOARD_RANGE = 'DASHBOARD_RANGE';

export const getDashboardContent = (token, param) => ({
  type: GET_DASHBOARD,
  token,
  param
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
  param
});

export const getClosedLoopOwnerDetails = (token, param) => ({
  type: GET_CLOSED_LOOP_OWNER_DETAILS,
  token,
  param
});

export const updateTicket = () => ({
  type: UPDATE_TICKET
});

export const addTicket = () => ({
  type: ADD_CLOSED_LOOP_TICKET
});
