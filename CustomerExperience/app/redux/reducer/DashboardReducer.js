import {getUniqueValues} from '../../Utils/TicketUtils';
import {
  ACTIONS_RECEIVED,
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES_RECEIVED,
  ROOT_CASUES_RECEIVED,
  ROOT_CAUSE_UPDATE_RECEIVED,
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
  FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
  REMOVE_CLOSED_LOOP_TICKET_ITEM,
  SEGMENT_SELECTED,
  SEGMENT_SELECTOR_OPEN,
  UPDATE_CLF_TICKET_RECIEVED,
  WELCOME_SCREEN_DATA_RECIEVED,
  CLEAR_SEGEMENT_LIST,
} from '../actions/dashboard.actions';

const initialState = {
  dashboardData: {},
  dashboardTicketCount: {},
  currentNPSData: {},
  ticketDetails: {},
  ticketList: [],
  segmentDetails: {},
  segmentState: {},
  segmentList: [],
  rootCauseList: [],
  rootCauseActionList: [],
  isSegmentSelectorOpen: false,
  ownerDetails: {},
  allOwnersDetails: {},
  currentSegment: {},
  currentFeedback: {},
  ticketFilter: {},
  ticket: {},
  ticketComments: [],
  ticketActivity: [],
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
        currentNPSData: getCurrentNPS(action.segmentId, action.npsScoreList),
      };
    }
    case CLOSED_LOOP_TICKET_DETAILS_RECEIVED: {
      return {
        ...state,
        ticketDetails: action.response.body,
        // ticketList: getTicketList(state, action.response.body),
      };
    }
    case CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED: {
      return {
        ...state,
        segmentState: action.response.body,
        segmentList: getSegmentListData(state, action.response.body),
      };
    }

    case FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED: {
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

    case SEGMENT_SELECTED: {
      // console.log(`SEGEMENT TESTING: prev  ${JSON.stringify(state.segment)}`);
      // console.log(`SEGEMENT TESTING: new ${JSON.stringify(action.segment)}`);

      return {
        ...state,
        currentSegment: {
          currentSegment: action.segment.segmentName,
          currentSegmentID: action.segment.segmentID,
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
        ticketComments: [],
        ticketActivity: {},
        apiCallStatus: {},
      };
    }

    case CLEAR_SEGEMENT_LIST: {
      return {
        ...state,
        segmentList: [],
      };
    }

    case SEGMENT_SELECTOR_OPEN: {
      return {...state, isSegmentSelectorOpen: action.isOpen};
    }

    case CLOSED_LOOP_TICKET_LIST_RECEIVED: {
      // console.log('TICKETLIST', action.response);
      return {
        ...state,
        ticketDetails: action.response,
        ticketList: getTicketList(state, action.response),
      };
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
      console.log('TICKETCOMMENTS', action.ticketComments);
      return {...state, ticketComments: action.ticketComments};
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
        ticketComments: [],
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
        ticket: action.ticketData,
        ticketComments: action.ticketComments,
        ticketActivity: action.ticketActivity,
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

    case ROOT_CASUES_RECEIVED: {
      return {
        ...state,
        rootCauseList: action.response,
      };
    }

    case ACTIONS_RECEIVED: {
      return {
        ...state,
        rootCauseActionList: action.response,
      };
    }

    case ROOT_CAUSE_UPDATE_RECEIVED: {
      return {
        ...state,
        ticket: {
          ...state.ticket,
          rootCauses: action.response.rootCauses,
          rootCauseActions: action.response.rootCauseActions,
        },
      };
    }

    default: {
      return state;
    }
  }
};

const getSegmentListData = (state, segmentDetails_) => {
  if (segmentDetails_.pageOffset === '0') {
    return [...segmentDetails_.segments];
  } else {
    return getUniqueValues(
      [...state.segmentList, ...segmentDetails_.segments],
      'segmentID',
    );
    // [...new Map(list.map((item) => [item['segmentID'], item])).values()];
  }
};

const getTicketList = (state, ticketDetails_) => {
  console.log(
    'TICKET_PAGE_NUMBER:',
    ticketDetails_.pagerOptions.pagerDto.pageNumber,
  );
  if (ticketDetails_.pagerOptions.pagerDto.pageNumber === 1) {
    return [...ticketDetails_.data];
  } else {
    return getUniqueValues([...state.ticketList, ...ticketDetails_.data], 'id');
    // [...new Map(list.map((item) => [item['segmentID'], item])).values()];
  }
};

const getCurrentNPS = (segmentId, npsScoreList) => {
  let index = npsScoreList.findIndex(
    (element) => element['storeId'] === segmentId,
  );
  return index >= 0 ? npsScoreList[index] : {};
};
export default dashboardReducer;
