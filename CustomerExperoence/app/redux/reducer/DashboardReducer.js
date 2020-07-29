import {DASHBOARD_RECEIVED, DETRACTOR_TICKET_RECEIVED} from '../actions/index';

const initialState = {
  dashboardData: {},
  detractorTickets: {},
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_RECEIVED: {
      return {
        ...state,
        dashboardData: action.response,
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
