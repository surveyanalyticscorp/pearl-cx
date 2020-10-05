export const GET_DASHBOARD = 'GET_DASHBOARD';
export const DASHBOARD_RECEIVED = 'DASHBOARD_RECEIVED';
export const SET_DASHBOARD_RANGE_FILTER = 'SET_DASHBOARD_RANGE_FILTER';
export const GET_DETRACTOR_TICKET = 'GET_DETRACTOR_TICKET';
export const DETRACTOR_TICKET_RECEIVED = 'DETRACTOR_TICKET_RECEIVED';
export const GET_DETRACTOR_TICKET_DETAILS = 'GET_DETRACTOR_TICKET_DETAILS';
export const DETRACTOR_TICKET_DETAILS_RECEIVED = 'DETRACTOR_TICKET_DETAILS_RECEIVED';
export const CLEAR_DETRACTOR_TICKET_DETAILS = 'CLEAR_DETRACTOR_TICKET_DETAILS';

export const DASHBOARD_RANGE = 'DASHBOARD_RANGE';

export const getDashboardContent = (token, param) => ({
  type: GET_DASHBOARD,
  token,
  param
});

export const setDashboardRangeFilter = range => ({
  type: SET_DASHBOARD_RANGE_FILTER,
  range,
});

export const getDetractorContent = (param, token) => ({
  type: GET_DETRACTOR_TICKET,
  param,
  token,
});


export const getDetractorTicketDetails = (param) => ({
  type: GET_DETRACTOR_TICKET_DETAILS,
  param,
});

export const clearDetractorTicketDetails = () => ({
  type: CLEAR_DETRACTOR_TICKET_DETAILS,
});
