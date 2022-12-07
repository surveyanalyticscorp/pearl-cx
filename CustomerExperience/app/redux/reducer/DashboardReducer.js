import {
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES_RECEIVED,
  SEND_EMAIL_RECEIVED,
} from '../actions/closedloop.actions';
import {
  CLEAR_CLOSED_LOOP_TICKET_DETAILS,
  CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED,
  CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
  CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
  CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
  CLOSED_LOOP_TICKET_ITEM_RECEIVED,
  CLOSED_LOOP_TICKET_LIST_RECEIVED,
  CREATE_CLF_TICKET_RECIEVED,
  DASHBOARD_RECEIVED,
  REMOVE_CLOSED_LOOP_TICKET_ITEM,
  SEGMENT_SELECTED,
  UPDATE_CLF_TICKET_RECIEVED,
  WELCOME_SCREEN_DATA_RECIEVED,
} from '../actions/dashboard.actions';

const initialState = {
  dashboardData: {},
  dashboardTicketCount: {},
  ticketDetails: {},
  segmentDetails: {},
  ownerDetails: {},
  allOwnersDetails: {},
  currentSegment: {},
  currentFeedback: {},
  ticket: {},
  ticketComments: {},
  ticketActivity: {},
  apiCallStatus: {},
  welcomeScreenData: {},
  emailData: {},
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_RECEIVED: {
      return {
        ...state,
        dashboardData: action.response.body,
        dashBoardTicketCount: action.ticketCount.data,
      };
    }
    case CLOSED_LOOP_TICKET_DETAILS_RECEIVED: {
      return {
        ...state,
        ticketDetails: action.response.body,
      };
    }
    case CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED: {
      return {
        ...state,
        segmentDetails: action.response.body,
        currentSegment: {
          currentSegment: action.response.body.currentSegment,
          currentSegmentID: action.response.body.currentSegmentID,
        },
        currentFeedback: {
          feedbackID: action.response.body.feedbackID,
        },
      };
    }
    case CLOSED_LOOP_OWNER_DETAILS_RECEIVED: {
      return {
        ...state,
        ownerDetails: action.response.body,
      };
    }

    case CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED: {
      return {
        ...state,
        allOwnersDetails: action.response.body,
      };
    }
    case CLEAR_CLOSED_LOOP_TICKET_DETAILS: {
      return {
        ...state,
        ticketDetails: {},
        segmentDetails: {},
        ownerDetails: {},
        ticket: {},
        ticketComments: {},
        ticketActivity: {},
        apiCallStatus: {},
      };
    }

    case SEGMENT_SELECTED: {
      // console.log(`SEGEMENT TESTING: prev  ${JSON.stringify(state.segment)}`);
      console.log(`SEGEMENT TESTING: new ${JSON.stringify(action.segment)}`);

      return {
        ...state,
        currentSegment: {
          currentSegment: action.segment.segmentName,
          currentSegmentID: action.segment.segmentID,
        },
      };
    }

    case CLOSED_LOOP_TICKET_LIST_RECEIVED: {
      // console.log('TICKETLIST', action.response);
      return {...state, ticketDetails: action.response};
    }

    case CLOSED_LOOP_TICKET_ITEM_RECEIVED: {
      // console.log('TICKETDETAILS', action.response.data);
      return {
        ...state,
        ticket: action.ticketData,
        ticketComments: action.ticketComments,
        ticketActivity: action.ticketActivity,
      };
    }

    case CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED: {
      // console.log('TICKETCOMMENTS', action.response.data);
      return {...state, ticketComments: action.response.data};
    }

    case CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED: {
      // console.log('TICKETACTIVITY', action.response.data);
      return {...state, ticketActivity: action.response.data};
    }

    case REMOVE_CLOSED_LOOP_TICKET_ITEM: {
      return {
        ...state,
        ticket: {},
        ticketActivity: {},
        ticketComments: {},
      };
    }

    case CREATE_CLF_TICKET_RECIEVED: {
      return {
        ...state,
        apiCallStatus: action.response,
      };
    }

    case UPDATE_CLF_TICKET_RECIEVED: {
      return {
        ...state,
        apiCallStatus: action.response,
        ticket: action.response.data,
      };
    }

    case WELCOME_SCREEN_DATA_RECIEVED: {
      return {
        ...state,
        welcomeScreenData: {
          cxData: action.cxResponse,
          clfData: action.clfResponse,
        },
      };
    }

    case GET_EMAIL_TEMPLATES_RECEIVED: {
      return {
        ...state,
        emailData: {...state.emailData, emailTemplates: action.response},
      };
    }

    case GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED: {
      return {
        ...state,
        emailData: {...state.emailData, defaultTemplate: action.response},
      };
    }
    case SEND_EMAIL_RECEIVED: {
      return {
        ...state,
        emailData: {...state.emailData, emailSentResponse: action.response},
      };
    }
    default: {
      return state;
    }
  }
};
export default dashboardReducer;
