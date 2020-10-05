import {
  CLEAR_DETRACTOR_TICKET_DETAILS,
  DASHBOARD_RECEIVED,
  DETRACTOR_TICKET_DETAILS_RECEIVED,
  DETRACTOR_TICKET_RECEIVED,
  SET_DASHBOARD_RANGE_FILTER,
} from '../actions/dashboard.actions';

const initialState = {
  dashboardData: {},
  detractorTickets: {},
  range:{
    type: 1,
    startDate: '',
    endDate: ''
  },
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
    case SET_DASHBOARD_RANGE_FILTER: {
      return {
        ...state,
        range: action.range,
      };
    }
    case DETRACTOR_TICKET_DETAILS_RECEIVED: {
      return {
        ...state,
        ticketDetails: action.response.response,
      };
    }
    case CLEAR_DETRACTOR_TICKET_DETAILS: {
      return {
        ...state,
        ticketDetails: {}
      }
    }

    default: {
      return state;
    }
  }
};
export default dashboardReducer;
