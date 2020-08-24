export const GET_DASHBOARD = 'GET_DASHBOARD';
export const DASHBOARD_RECEIVED = 'DASHBOARD_RECEIVED';
export const SET_DASHBOARD_RANGE_FILTER = 'SET_DASHBOARD_RANGE_FILTER';

export const getDashboardContent = token => ({
  type: GET_DASHBOARD,
  token,
});

export const setDashboardRangeFilter = range => ({
  type: SET_DASHBOARD_RANGE_FILTER,
  range,
});
