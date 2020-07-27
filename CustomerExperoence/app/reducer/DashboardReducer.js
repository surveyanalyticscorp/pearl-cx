import {
  DASHBOARD_RECEIVED,
  DETRACTOR_TICKET_RECEIVED,
  STORE_DASHBOARD_RECEIVED,
} from '../actions';

const initialState = {
  dashboardData: {},
  detractorTickets: {},
  storeDashboard: '',
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_RECEIVED: {
      return {
        ...state,
        dashboardData: action.response,
      };
    }
    case STORE_DASHBOARD_RECEIVED: {
      return {
        ...state,
        storeDashboard: action.response,
      };
    }
    case DETRACTOR_TICKET_RECEIVED: {
      return {
        ...state,
        detractorTickets: action.response,
      };
    }
    default: {
      return state;
    }
  }
};
export default dashboardReducer;
