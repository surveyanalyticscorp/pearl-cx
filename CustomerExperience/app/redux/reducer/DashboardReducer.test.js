import dashboardReducer from './DashboardReducer';
import {getUniqueValues} from '../../Utils/TicketUtils';
import {
  ACTIONS_RECEIVED,
  ACTION_HISTORY_DETAILS_RECEIVED,
  ACTION_HISTORY_SUMMARY_RECEIVED,
  CLEAR_TICKET_SYNC,
  DELETE_TICKET_COMPLETE,
  DELETE_TICKET_STATUS_RESET,
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES_RECEIVED,
  GET_TICKET_LIST_SYNC_RECEIVED,
  MEDIA_FILE_UPLOAD_RESET,
  MEDIA_FILE_UPLOAD_RESPONSE,
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
  RESET_CREATE_CLF_TICKET_RECIEVED,
} from '../actions/dashboard.actions';
import {SET_EMAIL_SUBJECT} from '../actions/email.actions';

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
  selectedRootCauses: {},
  isSegmentSelectorOpen: false,
  ownerDetails: {},
  allOwnersDetails: {},
  currentSegment: {},
  currentFeedback: {},
  ticketFilter: {},
  ticket: {},
  ticketTags: [],
  ticketComments: [],
  ticketActivity: [],
  createTicketResponse: {},
  ticketSync: true,
  apiCallStatus: {},
  welcomeScreenData: {},
  emailData: {currentEmailBody: {}, emailSentResponse: {}},
  generatedEmailDraftResponse: {
    context: '',
    response: {},
  },
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
  centralizedRootCauseUpdateStatus: {},
};

// write test for dashboard reducer
describe('Dashboard Reducer', () => {
  it('should return the initial state', () => {
    expect(dashboardReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle DASHBOARD_RECEIVED', () => {
    // mock getCurrentNPS function
    const getCurrentNPS = jest.fn();
    getCurrentNPS.mockReturnValue({
      NPSScore: 'NPS Score',
      DetractorTicketsCount: 'Detractor Tickets Count',
      filterName: 'Segment 1',
      storeName: 'Segment 1',
      storeId: 1,
    });

    expect(
      dashboardReducer(initialState, {
        type: DASHBOARD_RECEIVED,
        response: {
          body: {
            data: {
              ticketCount: 0,
              tickets: [],
            },
          },
        },
        ticketCount: {
          data: 'Detractor Tickets Count',
        },
        segmentId: 1,
        npsScoreList: [
          {
            filterName: 'Segment 1',
            storeName: 'Segment 1',
            storeId: 1,
          },
          {
            filterName: 'Segment 2',
            storeName: 'Segment 2',
            storeId: 2,
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      dashboardData: {
        data: {
          ticketCount: 0,
          tickets: [],
        },
      },
      dashBoardTicketCount: 'Detractor Tickets Count',
      currentNPSData: {
        filterName: 'Segment 1',
        storeName: 'Segment 1',
        storeId: 1,
      },
    });
  });

  it('should handle CLOSED_LOOP_TICKET_DETAILS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
        response: {
          body: {
            data: {
              ticketCount: 0,
              tickets: [],
            },
          },
        },
      }),
    ).toEqual({
      ...initialState,
      dashboardData: {},
      ticketDetails: {
        data: {
          ticketCount: 0,
          tickets: [],
        },
      },
    });
  });

  it('should handle CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED', () => {
    expect(
      dashboardReducer(
        {
          ...initialState,
          segmentList: [
            {
              segmentID: 1,
              segmentName: 'segment 1',
            },
            {
              segmentID: 2,
              segmentName: 'segment 2',
            },
          ],
        },
        {
          type: CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
          response: {
            body: {
              pageOffset: '0',
              count: 2,
              feedbackID: 1,
              currentSegment: 'segment 1',
              currentSegmentID: 1,
              segments: [
                {
                  segmentID: 1,
                  segmentName: 'segment 1',
                },
                {
                  segmentID: 2,
                  segmentName: 'segment 2',
                },
                {
                  segmentID: 3,
                  segmentName: 'segment 3',
                },
              ],
            },
          },
        },
      ),
    ).toEqual({
      ...initialState,
      segmentState: {
        pageOffset: '0',
        count: 2,
        feedbackID: 1,
        currentSegment: 'segment 1',
        currentSegmentID: 1,
        segments: [
          {
            segmentID: 1,
            segmentName: 'segment 1',
          },
          {
            segmentID: 2,
            segmentName: 'segment 2',
          },
          {
            segmentID: 3,
            segmentName: 'segment 3',
          },
        ],
      },
      segmentList: [
        {
          segmentID: 1,
          segmentName: 'segment 1',
        },
        {
          segmentID: 2,
          segmentName: 'segment 2',
        },
        {
          segmentID: 3,
          segmentName: 'segment 3',
        },
      ],
    });
  });

  it('should handle CLOSED_LOOP_OWNER_DETAILS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
        response: {
          body: {
            data: {
              ticketCount: 0,
              tickets: [],
            },
          },
        },
      }),
    ).toEqual({
      ...initialState,
      ownerDetails: {
        data: {
          ticketCount: 0,
          tickets: [],
        },
      },
    });
  });

  it('should handle CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED,
        response: {
          body: {
            data: {
              ticketCount: 0,
              tickets: [],
            },
          },
        },
      }),
    ).toEqual({
      ...initialState,
      allOwnersDetails: {
        data: {
          ticketCount: 0,
          tickets: [],
        },
      },
    });
  });

  it('should handle CLEAR_CLOSED_LOOP_TICKET_DETAILS', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLEAR_CLOSED_LOOP_TICKET_DETAILS,
      }),
    ).toEqual({
      ...initialState,
      ticketDetails: {},
      segmentDetails: {},
      ownerDetails: {},
      ticket: {},
      ticketComments: [],
      ticketActivity: [],
      apiCallStatus: {},
    });
  });

  it('should handle SEGMENT_SELECTED', () => {
    expect(
      dashboardReducer(initialState, {
        type: SEGMENT_SELECTED,
        segment: {
          segmentName: 'mock-segment-name',
          segmentID: 'mock-segment-id',
        },
      }),
    ).toEqual({
      ...initialState,
      currentSegment: {
        currentSegment: 'mock-segment-name',
        currentSegmentID: 'mock-segment-id',
      },
    });
  });

  it('should handle SEGMENT_SELECTOR_OPEN', () => {
    expect(
      dashboardReducer(initialState, {
        type: SEGMENT_SELECTOR_OPEN,
        isOpen: true,
      }),
    ).toEqual({
      ...initialState,
      isSegmentSelectorOpen: true,
    });
  });

  it('should handle SET_FILTER_BY_STATUS_ID', () => {
    expect(
      dashboardReducer(initialState, {
        type: SET_FILTER_BY_STATUS_ID,
        currentStatusIndex: 0,
      }),
    ).toEqual({
      ...initialState,
      currentStatusIndexForFilter: 0,
    });
  });

  it('should handle SET_TOKEN_EXPIRED', () => {
    expect(
      dashboardReducer(initialState, {
        type: SET_TOKEN_EXPIRED,
        isTokenExpired: true,
      }),
    ).toEqual({
      ...initialState,
      isTokenExpired: true,
    });
  });

  it('should handle SET_TOKEN_EXPIRE_DATE', () => {
    expect(
      dashboardReducer(initialState, {
        type: SET_TOKEN_EXPIRE_DATE,
        date: 'mock-date',
      }),
    ).toEqual({
      ...initialState,
      expirationDate: 'mock-date',
    });
  });

  it('should handle IS_CSAT_VIEW_TOP_BOX', () => {
    expect(
      dashboardReducer(initialState, {
        type: IS_CSAT_VIEW_TOP_BOX,
        isTopBoxView: true,
      }),
    ).toEqual({
      ...initialState,
      isCsatViewTopBox: true,
    });
  });

  it('should handle SET_MOVE_NEXT', () => {
    expect(
      dashboardReducer(initialState, {
        type: SET_MOVE_NEXT,
        doesMoveNext: true,
      }),
    ).toEqual({
      ...initialState,
      skipWelcome: true,
    });
  });

  it('should handle CLEAR_SEGEMENT_LIST', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLEAR_SEGEMENT_LIST,
      }),
    ).toEqual({
      ...initialState,
      segmentList: [],
    });
  });

  it('should handle SET_PARENT_COMMENT', () => {
    expect(
      dashboardReducer(initialState, {
        type: SET_PARENT_COMMENT,
        parentComment: {
          id: 0,
          isFocused: false,
        },
      }),
    ).toEqual({
      ...initialState,
      parentComment: {
        id: 0,
        isFocused: false,
      },
    });
  });

  it('should handle RESET_PARENT_COMMENT', () => {
    expect(
      dashboardReducer(initialState, {
        type: RESET_PARENT_COMMENT,
      }),
    ).toEqual({
      ...initialState,
      parentComment: {
        id: 0,
        isFocused: false,
      },
    });
  });

  it('should handle WELCOME_SCREEN_DATA_RECIEVED ', () => {
    expect(
      dashboardReducer(initialState, {
        type: WELCOME_SCREEN_DATA_RECIEVED,
        cxResponse: 'cxResponse',
        clfResponse: 'clfResponse',
      }),
    ).toEqual({
      ...initialState,
      welcomeScreenData: {
        cxData: 'cxResponse',
        clfData: 'clfResponse',
      },
    });
  });

  it('should handle ACTIONS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: ACTIONS_RECEIVED,

        response: [
          {
            id: '1',
            name: 'action1',
            description: 'action1 description',
            type: 'action',
            actionType: 'button',
            buttonText: 'action1',
            buttonUrl: 'https://action1.com',
          },
          {
            id: '2',
            name: 'action2',
            description: 'action2 description',
            type: 'action',
            actionType: 'button',
            buttonText: 'action2',
            buttonUrl: 'https://action2.com',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      rootCauseActionList: [
        {
          id: '1',
          name: 'action1',
          description: 'action1 description',
          type: 'action',
          actionType: 'button',
          buttonText: 'action1',
          buttonUrl: 'https://action1.com',
        },
        {
          id: '2',
          name: 'action2',
          description: 'action2 description',
          type: 'action',
          actionType: 'button',
          buttonText: 'action2',
          buttonUrl: 'https://action2.com',
        },
      ],
    });
  });

  it('should handle ACTION_HISTORY_SUMMARY_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: ACTION_HISTORY_SUMMARY_RECEIVED,

        response: {
          id: '1',
          name: 'action1',
          description: 'action1 description',
          type: 'action',
          actionType: 'button',
          buttonText: 'action1',
          buttonUrl: 'https://action1.com',
        },
      }),
    ).toEqual({
      ...initialState,
      ticketActionHistory: {
        ...initialState.ticketActionHistory,
        summary: {
          id: '1',
          name: 'action1',
          description: 'action1 description',
          type: 'action',
          actionType: 'button',
          buttonText: 'action1',
          buttonUrl: 'https://action1.com',
        },
      },
    });
  });

  it('should handle ACTION_HISTORY_DETAILS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: ACTION_HISTORY_DETAILS_RECEIVED,

        response: {
          id: '1',
          name: 'action1',
          description: 'action1 description',
          type: 'action',
          actionType: 'button',
          buttonText: 'action1',
          buttonUrl: 'https://action1.com',
        },
      }),
    ).toEqual({
      ...initialState,
      ticketActionHistory: {
        ...initialState.ticketActionHistory,
        details: {
          id: '1',
          name: 'action1',
          description: 'action1 description',
          type: 'action',
          actionType: 'button',
          buttonText: 'action1',
          buttonUrl: 'https://action1.com',
        },
      },
    });
  });
  it('should handle CLEAR_TICKET_SYNC', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLEAR_TICKET_SYNC,
      }),
    ).toEqual({
      ...initialState,
      ticketSync: true,
    });
  });

  it('should handle DELETE_TICKET_COMPLETE', () => {
    expect(
      dashboardReducer(initialState, {
        type: DELETE_TICKET_COMPLETE,

        response: {
          status: 'success',
        },
      }),
    ).toEqual({
      ...initialState,
      ticketDeleteStatus: {status: 'success'},
    });
  });

  it('should handle DELETE_TICKET_STATUS_RESET', () => {
    expect(
      dashboardReducer(initialState, {
        type: DELETE_TICKET_STATUS_RESET,
      }),
    ).toEqual({
      ...initialState,
      ticketDeleteStatus: {status: 'default'},
    });
  });

  it('should handle GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,

        response: {
          id: '1',
          name: 'template1',
          description: 'template1 description',
          type: 'email',
          actionType: 'button',
          buttonText: 'template1',
          buttonUrl: 'https://template1.com',
        },
      }),
    ).toEqual({
      ...initialState,
      emailData: {
        ...initialState.emailData,
        defaultTemplate: {
          id: '1',
          name: 'template1',
          description: 'template1 description',
          type: 'email',
          actionType: 'button',
          buttonText: 'template1',
          buttonUrl: 'https://template1.com',
        },
      },
    });
  });
  it('should handle GET_EMAIL_TEMPLATES_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: GET_EMAIL_TEMPLATES_RECEIVED,

        response: [
          {
            id: '1',
            name: 'template1',
            description: 'template1 description',
            type: 'email',
            actionType: 'button',
            buttonText: 'template1',
            buttonUrl: 'https://template1.com',
          },
          {
            id: '2',
            name: 'template2',
            description: 'template2 description',
            type: 'email',
            actionType: 'button',
            buttonText: 'template2',
            buttonUrl: 'https://template2.com',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      emailData: {
        ...initialState.emailData,
        emailTemplates: [
          {
            id: '1',
            name: 'template1',
            description: 'template1 description',
            type: 'email',
            actionType: 'button',
            buttonText: 'template1',
            buttonUrl: 'https://template1.com',
          },
          {
            id: '2',
            name: 'template2',
            description: 'template2 description',
            type: 'email',
            actionType: 'button',
            buttonText: 'template2',
            buttonUrl: 'https://template2.com',
          },
        ],
      },
    });
  });

  it('should handle GET_TICKET_LIST_SYNC_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: GET_TICKET_LIST_SYNC_RECEIVED,

        response: {
          hasNextCall: true,
        },
      }),
    ).toEqual({
      ...initialState,
      ticketSync: true,
    });
  });

  it('should handle MEDIA_FILE_UPLOAD_RESET', () => {
    expect(
      dashboardReducer(initialState, {
        type: MEDIA_FILE_UPLOAD_RESET,
      }),
    ).toEqual({
      ...initialState,
      mediaFileList: [],
    });
  });

  it('should handle MEDIA_FILE_UPLOAD_RESPONSE', () => {
    expect(
      dashboardReducer(initialState, {
        type: MEDIA_FILE_UPLOAD_RESPONSE,
        response: {
          data: {
            id: '1',
            name: 'file1',
            description: 'file1 description',
            type: 'file',
            actionType: 'button',
            buttonText: 'file1',
            buttonUrl: 'https://file1.com',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      mediaFileList: [
        {
          id: '1',
          name: 'file1',
          description: 'file1 description',
          type: 'file',
          actionType: 'button',
          buttonText: 'file1',
          buttonUrl: 'https://file1.com',
        },
      ],
    });
  });

  it('should handle ROOT_CASUES_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: ROOT_CASUES_RECEIVED,

        response: [
          {
            id: '1',
            name: 'rootCause1',
            description: 'rootCause1 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause1',
            buttonUrl: 'https://rootCause1.com',
          },
          {
            id: '2',
            name: 'rootCause2',
            description: 'rootCause2 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause2',
            buttonUrl: 'https://rootCause2.com',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      rootCauseList: [
        {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
        {
          id: '2',
          name: 'rootCause2',
          description: 'rootCause2 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause2',
          buttonUrl: 'https://rootCause2.com',
        },
      ],
    });
  });
  it('should handle ROOT_CAUSE_UPDATE_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: ROOT_CAUSE_UPDATE_RECEIVED,

        ticketData: {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
      }),
    ).toEqual({
      ...initialState,
      ticket: {
        id: '1',
        name: 'rootCause1',
        description: 'rootCause1 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause1',
        buttonUrl: 'https://rootCause1.com',
      },
      selectedRootCauses: {
        hasUpdated: false,
      },
    });
  });

  it('should handle TICKET_ESCALATION_RECIEVED', () => {
    expect(
      dashboardReducer(
        {
          ...initialState,

          ticket: {
            id: 1,
            name: 'ticket 1',
            description: 'description 1',
            status: 'LOW',
            assignToId: 1,
          },
        },
        {
          type: TICKET_ESCALATION_RECIEVED,

          ticketData: {
            assignToId: 2,
            status: 'ESCALATED',
          },
          ticketActivity: [
            {
              id: '1',
              name: 'rootCause1',
              description: 'rootCause1 description',
              actionType: 'button',
              buttonText: 'rootCause1',
              buttonUrl: 'https://rootCause1.com',
            },
          ],
        },
      ),
    ).toEqual({
      ...initialState,
      ticket: {
        id: 1,
        name: 'ticket 1',
        description: 'description 1',
        status: 'ESCALATED',
        assignToId: 2,
      },
      ticketActivity: [
        {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
      ],
    });
  });

  it('should handle SEND_EMAIL_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: SEND_EMAIL_RECEIVED,

        response: {
          id: '1',
          name: 'template1',
          description: 'template1 description',
          type: 'email',
          actionType: 'button',
          buttonText: 'template1',
          buttonUrl: 'https://template1.com',
        },
      }),
    ).toEqual({
      ...initialState,
      emailData: {
        currentEmailBody: {},
        emailSentResponse: {
          id: '1',
          name: 'template1',
          description: 'template1 description',
          type: 'email',
          actionType: 'button',
          buttonText: 'template1',
          buttonUrl: 'https://template1.com',
        },
      },
    });
  });

  it('should handle CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,

        ticketActivity: [
          {
            id: '1',
            name: 'rootCause1',
            description: 'rootCause1 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause1',
            buttonUrl: 'https://rootCause1.com',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      ticketActivity: [
        {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
      ],
    });
  });

  it('should handle CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,

        ticketComments: [
          {
            id: '1',
            name: 'rootCause1',
            description: 'rootCause1 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause1',
            buttonUrl: 'https://rootCause1.com',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      ticketComments: [
        {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
      ],
    });
  });

  it('should handle CLOSED_LOOP_TICKET_ITEM_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,

        ticketData: {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
        ticketComments: [
          {
            id: '1',
            comment: 'rootCause1 comment',
            createdAt: '2020-01-01T00:00:00.000Z',
          },
        ],
        ticketActivity: [
          {
            id: '1',
            action: 'rootCause1 activity',
            createdAt: '2020-01-01T00:00:00.000Z',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      ticket: {
        id: '1',
        name: 'rootCause1',
        description: 'rootCause1 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause1',
        buttonUrl: 'https://rootCause1.com',
      },
      selectedRootCauses: {
        hasUpdated: false,
      },
      ticketComments: [
        {
          id: '1',
          comment: 'rootCause1 comment',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      ticketActivity: [
        {
          id: '1',
          action: 'rootCause1 activity',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
    });
  });

  it('should handle CLOSED_LOOP_TICKET_LIST_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CLOSED_LOOP_TICKET_LIST_RECEIVED,

        response: {
          data: [
            {
              id: '1',
              name: 'rootCause1',
              description: 'rootCause1 description',
              type: 'rootCause',
              actionType: 'button',
              buttonText: 'rootCause1',
              buttonUrl: 'https://rootCause1.com',
            },
            {
              id: '2',
              name: 'rootCause2',
              description: 'rootCause2 description',
              type: 'rootCause',
              actionType: 'button',
              buttonText: 'rootCause2',
              buttonUrl: 'https://rootCause2.com',
            },
          ],
          pagerOptions: {
            pagerDto: {
              pageNumber: 1,
              perPage: 10,
            },
            totalCount: 2,
          },
        },
      }),
    ).toEqual({
      ...initialState,
      ticketDetails: {
        data: [
          {
            id: '1',
            name: 'rootCause1',
            description: 'rootCause1 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause1',
            buttonUrl: 'https://rootCause1.com',
          },
          {
            id: '2',
            name: 'rootCause2',
            description: 'rootCause2 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause2',
            buttonUrl: 'https://rootCause2.com',
          },
        ],
        pagerOptions: {
          pagerDto: {
            pageNumber: 1,
            perPage: 10,
          },
          totalCount: 2,
        },
      },
      ticketList: [
        {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
        {
          id: '2',
          name: 'rootCause2',
          description: 'rootCause2 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause2',
          buttonUrl: 'https://rootCause2.com',
        },
      ],
    });
  });
  it('should handle CREATE_CLF_TICKET_RECIEVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: CREATE_CLF_TICKET_RECIEVED,
        response: {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
      }),
    ).toEqual({
      ...initialState,
      createTicketResponse: {
        id: '1',
        name: 'rootCause1',
        description: 'rootCause1 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause1',
        buttonUrl: 'https://rootCause1.com',
      },
    });
  });

  it('should handle RESET_CREATE_CLF_TICKET_RECIEVED', () => {
    expect(
      dashboardReducer(
        {
          ...initialState,
          createTicketResponse: {
            id: '1',
            name: 'test',
          },
        },
        {
          type: RESET_CREATE_CLF_TICKET_RECIEVED,
        },
      ),
    ).toEqual({
      ...initialState,
      createTicketResponse: {},
    });
  });

  it('should handle UPDATE_CLF_TICKET_RECIEVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: UPDATE_CLF_TICKET_RECIEVED,
        response: {hasNextCall: true, status: 'success'},
        ticketData: {
          id: '1',
          name: 'rootCause1',
          description: 'rootCause1 description',
          type: 'rootCause',
          actionType: 'button',
          buttonText: 'rootCause1',
          buttonUrl: 'https://rootCause1.com',
        },
        ticketComments: [
          {
            id: '1',
            comment: 'rootCause1 comment',
            createdAt: '2020-01-01T00:00:00.000Z',
          },
        ],
        ticketActivity: [
          {
            id: '1',
            action: 'rootCause1 activity',
            createdAt: '2020-01-01T00:00:00.000Z',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      ticket: {
        id: '1',
        name: 'rootCause1',
        description: 'rootCause1 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause1',
        buttonUrl: 'https://rootCause1.com',
      },
      selectedRootCauses: {
        hasUpdated: false,
      },
      apiCallStatus: {hasNextCall: true, status: 'success'},
      ticketComments: [
        {
          id: '1',
          comment: 'rootCause1 comment',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      ticketActivity: [
        {
          id: '1',
          action: 'rootCause1 activity',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
    });
  });

  it('should handle FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED', () => {
    expect(
      dashboardReducer(initialState, {
        type: FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,

        response: {
          body: {
            currentSegment: 'segment1',
            currentSegmentID: 1,
            feedbackID: 1,
          },
        },
      }),
    ).toEqual({
      ...initialState,
      segmentDetails: {
        currentSegment: 'segment1',
        currentSegmentID: 1,
        feedbackID: 1,
      },
      currentSegment: {
        currentSegment: 'segment1',
        currentSegmentID: 1,
      },
      currentFeedback: {
        feedbackID: 1,
      },
    });
  });
  it('should handle REMOVE_CLOSED_LOOP_TICKET_ITEM', () => {
    expect(
      dashboardReducer(initialState, {
        type: REMOVE_CLOSED_LOOP_TICKET_ITEM,
        payload: {
          token: 'mock-token',
          ticketId: '1',
        },
      }),
    ).toEqual({
      ...initialState,
      ticket: {},
      ticketActivity: {},
      ticketComments: [],
    });
  });

  it('should handle SET_EMAIL_SUBJECT', () => {
    expect(
      dashboardReducer(initialState, {
        type: SET_EMAIL_SUBJECT,
        emailSubject: 'Test Email Subject',
      }),
    ).toEqual({
      ...initialState,
      emailData: {
        currentEmailBody: {
          subject: 'Test Email Subject',
        },
        emailSentResponse: {},
      },
    });
  });

  // test getUniqueValues
  it('should handle getUniqueValues', () => {
    expect(
      getUniqueValues(
        [
          {
            id: '1',
            name: 'rootCause1',
            description: 'rootCause1 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause1',
            buttonUrl: 'https://rootCause1.com',
          },
          {
            id: '2',
            name: 'rootCause2',
            description: 'rootCause2 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause2',
            buttonUrl: 'https://rootCause2.com',
          },
          {
            id: '3',
            name: 'rootCause3',
            description: 'rootCause3 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause3',
            buttonUrl: 'https://rootCause3.com',
          },
        ],
        'id',
      ),
    ).toEqual([
      {
        id: '1',
        name: 'rootCause1',
        description: 'rootCause1 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause1',
        buttonUrl: 'https://rootCause1.com',
      },
      {
        id: '2',
        name: 'rootCause2',
        description: 'rootCause2 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause2',
        buttonUrl: 'https://rootCause2.com',
      },
      {
        id: '3',
        name: 'rootCause3',
        description: 'rootCause3 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause3',
        buttonUrl: 'https://rootCause3.com',
      },
    ]);
  });
  it('should handle getUniqueValues with empty array', () => {
    expect(getUniqueValues([])).toEqual([]);
  });

  it('should handle getUniqueValues with null array', () => {
    expect(getUniqueValues(null)).toEqual([]);
  });

  it('should handle getUniqueValues with undefined array', () => {
    expect(getUniqueValues(undefined)).toEqual([]);
  });

  it('should handle getUniqueValues with object array', () => {
    expect(getUniqueValues([{id: '1'}, {id: '2'}, {id: '3'}], 'id')).toEqual([
      {id: '1'},
      {id: '2'},
      {id: '3'},
    ]);
  });
  it('should sort out the unique values', () => {
    expect(
      getUniqueValues(
        [
          {
            id: '1',
            name: 'rootCause1',
            description: 'rootCause1 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause1',
            buttonUrl: 'https://rootCause1.com',
          },
          {
            id: '2',
            name: 'rootCause2',
            description: 'rootCause2 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause2',
            buttonUrl: 'https://rootCause2.com',
          },
          {
            id: '3',
            name: 'rootCause3',
            description: 'rootCause3 description',
            type: 'rootCause',
            actionType: 'button',
            buttonText: 'rootCause3',
            buttonUrl: 'https://rootCause3.com',
          },
        ],
        'id',
      ),
    ).toEqual([
      {
        id: '1',
        name: 'rootCause1',
        description: 'rootCause1 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause1',
        buttonUrl: 'https://rootCause1.com',
      },
      {
        id: '2',
        name: 'rootCause2',
        description: 'rootCause2 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause2',
        buttonUrl: 'https://rootCause2.com',
      },
      {
        id: '3',
        name: 'rootCause3',
        description: 'rootCause3 description',
        type: 'rootCause',
        actionType: 'button',
        buttonText: 'rootCause3',
        buttonUrl: 'https://rootCause3.com',
      },
    ]);
  });
});
