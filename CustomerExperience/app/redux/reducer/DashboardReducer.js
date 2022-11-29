import {
  CLEAR_CLOSED_LOOP_TICKET_DETAILS,
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
  currentSegment: {},
  currentFeedback: {},
  ticket: {},
  ticketComments: {},
  ticketActivity: {},
  apiCallStatus: {},
  welcomeScreenData: {},
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
      // console.log(`SEGEMENT TESTING: new ${JSON.stringify(action.payload)}`);

      return {
        ...state,
        segment: action.payload,
      };
    }

    case CLOSED_LOOP_TICKET_LIST_RECEIVED: {
      // console.log('TICKETLIST', action.response);
      return {...state, ticketDetails: action.response};
    }

    case CLOSED_LOOP_TICKET_ITEM_RECEIVED: {
      // console.log('TICKETDETAILS', action.response.data);
      return {...state, ticket: action.response.data};
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
        welcomeScreenData: action.response,
      };
    }

    default: {
      return state;
    }
  }
};
export default dashboardReducer;
