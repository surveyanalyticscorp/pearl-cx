import {
  GET_TICKET_STATUS_HISTORY_RECEIVED,
  LATEST_COMMENT_RECEIVED,
} from '../actions/closedloop.actions';
import {
  CLEAR_ALL_RESPONSE_DATA,
  GET_RESPONSE_TICKETS_RECEIVED,
  PANEL_MEMBER_RECEIVED,
  SURVEY_RESPONSE_DETAILS_RECEIVED,
  RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED,
} from '../actions/feedback.actions';

const initialState = {
  panelMember: {},
  surveyDetails: {},
  responseTickets: {},
  ticketStatusHistory: {},
  ticketLastComment: {},
  responseDetailsByResponseDetails: {},
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case PANEL_MEMBER_RECEIVED: {
      return {
        ...state,
        panelMember: action.response.body ?? {},
      };
    }
    case SURVEY_RESPONSE_DETAILS_RECEIVED: {
      return {
        ...state,
        surveyDetails: action.response.body,
      };
    }

    case GET_RESPONSE_TICKETS_RECEIVED: {
      return {
        ...state,
        responseTickets: action.response,
      };
    }

    case CLEAR_ALL_RESPONSE_DATA: {
      return {
        panelMember: {},
        surveyDetails: {},
        responseTickets: {},
        ticketStatusHistory: {},
        ticketLastComment: {},
        responseDetailsByResponseDetails: {},
      };
    }
    case GET_TICKET_STATUS_HISTORY_RECEIVED: {
      return {
        ...state,
        ticketStatusHistory: action.response,
      };
    }
    case RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED: {
      return {
        ...state,
        responseDetailsByResponseDetails: action.data,
      };
    }
    case LATEST_COMMENT_RECEIVED: {
      return {
        ...state,
        ticketLastComment: action.response,
      };
    }

    default: {
      return state;
    }
  }
};

export default feedbackReducer;
