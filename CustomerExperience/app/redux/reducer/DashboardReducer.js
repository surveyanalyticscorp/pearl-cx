import {create} from 'lodash';
import {getUniqueValues} from '../../Utils/TicketUtils';
import {CLEAR_USER_INFO} from '../actions';
import {
  ACTIONS_RECEIVED,
  ACTION_HISTORY_DETAILS_RECEIVED,
  ACTION_HISTORY_SUMMARY_RECEIVED,
  CENTRALIZED_ROOT_CAUSE_RECEIVED,
  CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED,
  CLEAR_TICKET_SYNC,
  DELETE_TICKET_COMPLETE,
  DELETE_TICKET_STATUS_RESET,
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES_RECEIVED,
  GET_TICKET_LIST_SYNC_RECEIVED,
  MEDIA_FILE_UPLOAD_RESET,
  MEDIA_FILE_UPLOAD_RESPONSE,
  RESET_SEND_EMAIL_RESPONSE,
  ROOT_CASUES_RECEIVED,
  ROOT_CAUSE_UPDATE_RECEIVED,
  SEND_EMAIL_RECEIVED,
  TICKET_ESCALATION_RECIEVED,
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
  REMOVE_CLOSED_LOOP_TICKET_ITEM,
  SEGMENT_SELECTED,
  SEGMENT_SELECTOR_OPEN,
  UPDATE_CLF_TICKET_RECIEVED,
  WELCOME_SCREEN_DATA_RECIEVED,
  CLEAR_SEGEMENT_LIST,
  SET_PARENT_COMMENT,
  RESET_PARENT_COMMENT,
  SET_FILTER_BY_STATUS_ID,
  SET_TOKEN_EXPIRED,
  SET_TOKEN_EXPIRE_DATE,
  IS_CSAT_VIEW_TOP_BOX,
  SET_MOVE_NEXT,
  CLEAR_DASHBOARD,
} from '../actions/dashboard.actions';
import {
  SET_EMAIL_SUBJECT,
  TOGGLE_TEMPLATE_BOTTOM_SHEET,
} from '../actions/email.actions';

const initialState = {
  dashboardData: {},
  dashboardTicketCount: {},
  currentNPSData: {
    filterName: '',
    storeName: '',
    storeId: 243030,
    NPSScore: {
      totalResponses: 0,
      csatScore: 0,
      passivePercent: 0,
      questionTotal: 0,
      npsPercentage: 0,
      smartTotalResponses: '0',
      promoterFormattedPercent: 0,
      passive: 0,
      questionMeanScore: 0,
      detractorPercent: 0,
      benchmarkScore: 0,
      detractors: 0,
      detractorFormattedPercent: 0,
      npsScore: 0,
      promoters: 0,
      csatMeanAverage: 0,
      promoterPercent: 0,
      passiveFormattedPercent: 0,
    },
  },
  ticketDetails: {},
  ticketList: [],
  segmentDetails: {},
  segmentState: {},
  segmentList: [],
  rootCauseList: [],
  rootCauseActionList: [],
  centralizedRootCauseList: [],
  isSegmentSelectorOpen: false,
  ownerDetails: {},
  allOwnersDetails: {},
  currentSegment: {},
  currentFeedback: {},
  ticketFilter: {},
  ticket: {},
  ticketComments: [],
  ticketActivity: [],
  createTicketResponse: {},
  ticketSync: true,
  apiCallStatus: {},
  welcomeScreenData: {},
  emailData: {currentEmailBody: {}, emailSentResponse: {}},
  isEmailTemplateOpen: false,
  mediaFileList: [],
  ticketDeleteStatus: {status: 'default'},
  ticketActionHistory: {summary: {}, details: {}},
  parentComment: {id: 0, isFocused: false},
  currentStatusIndexForFilter: 0,
  isTokenExpired: false,
  expirationDate: '',
  isCsatViewTopBox: true,
  skipWelcome: false,
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
        ticketActivity: [],
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

    case GET_TICKET_LIST_SYNC_RECEIVED: {
      return {...state, ticketSync: action.response.hasNextCall};
    }

    case CLEAR_TICKET_SYNC: {
      return {...state, ticketSync: true};
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

    case CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED: {
      return {
        ...state,
        ticketActivity: action.ticketActivity,
      };
    }

    case CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED: {
      console.log('TICKETCOMMENTS', action.ticketComments);
      return {...state, ticketComments: action.ticketComments};
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
        createTicketResponse: action.response,
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

    case SET_EMAIL_SUBJECT: {
      return {
        ...state,
        emailData: {
          ...state.emailData,
          currentEmailBody: {
            ...state.emailData.currentEmailBody,
            subject: action.emailSubject,
          },
        },
      };
    }

    case TOGGLE_TEMPLATE_BOTTOM_SHEET: {
      return {
        ...state,
        isEmailTemplateOpen: action.isOpen,
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
    case RESET_SEND_EMAIL_RESPONSE: {
      return {
        ...state,
        emailData: {...state.emailData, emailSentResponse: {}}
      }
    }
    case SEND_EMAIL_RECEIVED: {
      return {
        ...state,
        emailData: {...state.emailData, emailSentResponse: action.response},
      };
    }

    case MEDIA_FILE_UPLOAD_RESPONSE: {
      return {
        ...state,
        mediaFileList: [...state.mediaFileList, action.response.data],
      };
    }

    case MEDIA_FILE_UPLOAD_RESET: {
      return {
        ...state,
        mediaFileList: [],
      };
    }

    case ROOT_CASUES_RECEIVED: {
      return {
        ...state,
        rootCauseList: action.response,
      };
    }

    case CENTRALIZED_ROOT_CAUSE_RECEIVED: {
      return {
        ...state,
        centralizedRootCauseList: action.response,
      };
    }

    case CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED: {
      return {
        ...state,
        ticket: action.response,
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
        ticket: action.ticketData,
      };
    }

    case TICKET_ESCALATION_RECIEVED: {
      return {
        ...state,
        ticket: {
          ...state.ticket,
          status: action.ticketData.status,
          assignToId: action.ticketData.assignToId,
        },
        ticketActivity: action.ticketActivity,
      };
    }

    case DELETE_TICKET_COMPLETE: {
      return {...state, ticketDeleteStatus: action.response};
    }

    case DELETE_TICKET_STATUS_RESET: {
      return {...state, ticketDeleteStatus: {status: 'default'}};
    }

    case ACTION_HISTORY_SUMMARY_RECEIVED: {
      return {
        ...state,
        ticketActionHistory: {
          ...state.ticketActionHistory,
          summary: action.response,
        },
      };
    }

    case ACTION_HISTORY_DETAILS_RECEIVED: {
      return {
        ...state,
        ticketActionHistory: {
          ...state.ticketActionHistory,
          details: action.response,
        },
      };
    }
    case SET_PARENT_COMMENT: {
      return {
        ...state,
        parentComment: action.parentComment,
      };
    }
    case RESET_PARENT_COMMENT: {
      return {
        ...state,
        parentComment: {id: 0, isFocused: false},
      };
    }

    case SET_FILTER_BY_STATUS_ID: {
      return {
        ...state,
        currentStatusIndexForFilter: action.currentStatusIndex,
      };
    }

    case SET_TOKEN_EXPIRED: {
      return {
        ...state,

        isTokenExpired: action.isTokenExpired,
      };
    }
    case SET_TOKEN_EXPIRE_DATE: {
      return {
        ...state,

        expirationDate: action.date,
      };
    }
    case IS_CSAT_VIEW_TOP_BOX: {
      return {
        ...state,
        isCsatViewTopBox: action.isTopBoxView,
      };
    }
    case SET_MOVE_NEXT: {
      return {
        ...state,
        skipWelcome: action.doesMoveNext,
      };
    }

    case CLEAR_DASHBOARD: {
      console.log('CLEAR_DASHBOARD');
      return {
        ...initialState,
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
    element => element['storeId'] === segmentId,
  );
  return index >= 0 ? npsScoreList[index] : {};
};
export default dashboardReducer;
