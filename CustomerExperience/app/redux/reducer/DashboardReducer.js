import {
  DASHBOARD_RECEIVED,
  DETRACTOR_TICKET_DETAILS_RECEIVED,
  DETRACTOR_TICKET_RECEIVED,
} from '../actions/dashboard.actions';

const initialState = {
  dashboardData: {},
  detractorTickets: {},
  ticketDetails: {}
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
    case DETRACTOR_TICKET_DETAILS_RECEIVED: {
      return {
        ...state,
        ticketDetails: action.response.response,
      };
    }
    default: {
      return state;
    }
  }
};
export default dashboardReducer;
