import {
  CLEAR_CLOSED_LOOP_TICKET_DETAILS,
  CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
  CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_ITEM_RECEIVED,
  CLOSED_LOOP_TICKET_LIST_RECEIVED,
  DASHBOARD_RECEIVED,
  SEGMENT_SELECTED,
} from '../actions/dashboard.actions';

const initialState = {
  dashboardData: {},
  ticketDetails: {},
  segmentDetails: {},
  ownerDetails: {},
  currentSegment: {},
  currentFeedback: {},
  ticketItem: {},
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_RECEIVED: {
      return {
        ...state,
        dashboardData: action.response.body,
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
        ticketItem: {},
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
      console.log('TICKET', action.response);
      return {...state, ticketDetails: action.response};
    }

    case CLOSED_LOOP_TICKET_ITEM_RECEIVED: {
      console.log('TICKET', action.response);
      return {...state, ticketItem: action.response};
    }

    default: {
      return state;
    }
  }
};
export default dashboardReducer;
