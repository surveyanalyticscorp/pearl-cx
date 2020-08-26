import {DASHBOARD_RECEIVED, SET_DASHBOARD_RANGE_FILTER} from '../actions/dashboard.actions';
import {DETRACTOR_TICKET_RECEIVED} from '../actions';

const initialState = {
  dashboardData: {},
  detractorTickets: {},
  range:{}
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_RECEIVED: {
      return {
        ...state,
        dashboardData: action.response.body,
      };
    }
    case DETRACTOR_TICKET_RECEIVED: {
      return {
        ...state,
        detractorTickets: action.response,
      };
    }
    case SET_DASHBOARD_RANGE_FILTER: {
      return {
        ...state,
        range: action.range,
      };
    }
    default: {
      return state;
    }
  }
};
export default dashboardReducer;
