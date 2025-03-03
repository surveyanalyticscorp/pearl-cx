import feedbackReducer from './FeedbackReducer';
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
  SET_RESPONSE_READ_LIST,
  SET_ALL_RESPONSES,
  ADD_TO_RESPONSE_READ_LIST,
  FETCH_ALL_RESPONSES_RECEIVED,
  SET_ALL_RESPONSES_EMPTY,
} from '../actions/feedback.actions';

const initialState = {
  panelMember: {},
  surveyDetails: {},
  responseTickets: {},
  ticketStatusHistory: {},
  ticketLastComment: {},
  responseDetailsByResponseDetails: {},
  allResponses: [],
  responseReadList: [],
};
// write testcases for the FeedbackReducer.js file
describe('Feedback Reducer', () => {
  it('should return the initial state', () => {
    expect(feedbackReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle PANEL_MEMBER_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: PANEL_MEMBER_RECEIVED,
        response: {
          body: {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            phone: '123-456-7890',
            organization: 'Example Organization',
            role: 'Customer Support',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      panelMember: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
        organization: 'Example Organization',
        role: 'Customer Support',
      },
    });
  });

  it('should handle SURVEY_RESPONSE_DETAILS_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: SURVEY_RESPONSE_DETAILS_RECEIVED,
        response: {
          body: {
            id: 1,
            surveyName: 'Survey Name',
            surveyId: 1,
            surveyType: 'Survey Type',
            status: 'Survey Status',
            startDate: '2023-01-01',
            endDate: '2023-01-01',
            createdBy: 'Survey Created By',
            createdDate: '2023-01-01',
            lastModifiedBy: 'Survey Last Modified By',
            lastModifiedDate: '2023-01-01',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      surveyDetails: {
        id: 1,
        surveyName: 'Survey Name',
        surveyId: 1,
        surveyType: 'Survey Type',
        status: 'Survey Status',
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        createdBy: 'Survey Created By',
        createdDate: '2023-01-01',
        lastModifiedBy: 'Survey Last Modified By',
        lastModifiedDate: '2023-01-01',
      },
    });
  });

  it('should handle GET_RESPONSE_TICKETS_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: GET_RESPONSE_TICKETS_RECEIVED,
        response: [
          {
            id: 1,
            ticketId: 1,
            surveyId: 1,
            surveyName: 'Survey Name',
            status: 'Survey Status',
            startDate: '2023-01-01',
            endDate: '2023-01-01',
            createdBy: 'Survey Created By',
            createdDate: '2023-01-01',
            lastModifiedBy: 'Survey Last Modified By',
            lastModifiedDate: '2023-01-01',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      responseTickets: [
        {
          id: 1,
          ticketId: 1,
          surveyId: 1,
          surveyName: 'Survey Name',
          status: 'Survey Status',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          createdBy: 'Survey Created By',
          createdDate: '2023-01-01',
          lastModifiedBy: 'Survey Last Modified By',
          lastModifiedDate: '2023-01-01',
        },
      ],
    });
  });

  it('should handle CLEAR_ALL_RESPONSE_DATA', () => {
    expect(
      feedbackReducer(initialState, {
        type: CLEAR_ALL_RESPONSE_DATA,
      }),
    ).toEqual({
      ...initialState,
      panelMember: {},
      surveyDetails: {},
      responseTickets: {},
      ticketStatusHistory: {},
      ticketLastComment: {},
      responseDetailsByResponseDetails: {},
      allResponses: [],
      responseReadList: [],
    });
  });

  it('should handle GET_TICKET_STATUS_HISTORY_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: GET_TICKET_STATUS_HISTORY_RECEIVED,
        response: [
          {
            id: 1,
            ticketId: 1,
            surveyId: 1,
            surveyName: 'Survey Name',
            status: 'Survey Status',
            startDate: '2023-01-01',
            endDate: '2023-01-01',
            createdBy: 'Survey Created By',
            createdDate: '2023-01-01',
            lastModifiedBy: 'Survey Last Modified By',
            lastModifiedDate: '2023-01-01',
          },
        ],
      }),
    ).toEqual({
      ...initialState,
      ticketStatusHistory: [
        {
          id: 1,
          ticketId: 1,
          surveyId: 1,
          surveyName: 'Survey Name',
          status: 'Survey Status',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          createdBy: 'Survey Created By',
          createdDate: '2023-01-01',
          lastModifiedBy: 'Survey Last Modified By',
          lastModifiedDate: '2023-01-01',
        },
      ],
    });
  });

  it('should handle RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED,
        data: {
          id: 1,
          ticketId: 1,
          surveyId: 1,
          surveyName: 'Survey Name',
          status: 'Survey Status',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          createdBy: 'Survey Created By',
          createdDate: '2023-01-01',
          lastModifiedBy: 'Survey Last Modified By',
          lastModifiedDate: '2023-01-01',
        },
      }),
    ).toEqual({
      ...initialState,
      responseDetailsByResponseDetails: {
        id: 1,
        ticketId: 1,
        surveyId: 1,
        surveyName: 'Survey Name',
        status: 'Survey Status',
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        createdBy: 'Survey Created By',
        createdDate: '2023-01-01',
        lastModifiedBy: 'Survey Last Modified By',
        lastModifiedDate: '2023-01-01',
      },
    });
  });

  it('should handle LATEST_COMMENT_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: LATEST_COMMENT_RECEIVED,
        response: {
          id: 1,
          ticketId: 1,
          surveyId: 1,
          surveyName: 'Survey Name',
          status: 'Survey Status',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          createdBy: 'Survey Created By',
          createdDate: '2023-01-01',
          lastModifiedBy: 'Survey Last Modified By',
          lastModifiedDate: '2023-01-01',
          comment: 'Latest Comment',
        },
      }),
    ).toEqual({
      ...initialState,
      ticketLastComment: {
        id: 1,
        ticketId: 1,
        surveyId: 1,
        surveyName: 'Survey Name',
        status: 'Survey Status',
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        createdBy: 'Survey Created By',
        createdDate: '2023-01-01',
        lastModifiedBy: 'Survey Last Modified By',
        lastModifiedDate: '2023-01-01',
        comment: 'Latest Comment',
      },
    });
  });

  it('should handle SET_RESPONSE_READ_LIST', () => {
    expect(
      feedbackReducer(initialState, {
        type: SET_RESPONSE_READ_LIST,
        responseReadList: [1, 2, 3],
        allResponses: [
          {id: 1, read: false},
          {id: 2, read: false},
          {id: 3, read: false},
        ],
      }),
    ).toEqual({
      ...initialState,
      responseReadList: [1, 2, 3],
      allResponses: [],
    });
  });

  it('should handle ADD_TO_RESPONSE_READ_LIST', () => {
    expect(
      feedbackReducer(
        {
          ...initialState,
          responseReadList: [],
          allResponses: [
            {id: 1, read: false},
            {id: 2, read: false},
            {id: 3, read: false},
          ],
        },
        {
          type: ADD_TO_RESPONSE_READ_LIST,

          responseSetID: 1,
        },
      ),
    ).toEqual({
      ...initialState,
      responseReadList: [1],
      allResponses: [
        {id: 1, read: false},
        {id: 2, read: false},
        {id: 3, read: false},
      ],
    });
  });

  it('should handle SET_ALL_RESPONSES', () => {
    expect(
      feedbackReducer(initialState, {
        type: SET_ALL_RESPONSES,
        allResponses: [{id: 1}, {id: 2}, {id: 3}],
      }),
    ).toEqual({
      ...initialState,
      allResponses: [
        {id: 1, read: false},
        {id: 2, read: false},
        {id: 3, read: false},
      ],
    });
  });

  it('should handle FETCH_ALL_RESPONSES_RECEIVED', () => {
    expect(
      feedbackReducer(initialState, {
        type: FETCH_ALL_RESPONSES_RECEIVED,
        pageOffset: 0,
        allResponses: [{id: 1}, {id: 2}, {id: 3}],
      }),
    ).toEqual({
      ...initialState,
      allResponses: [
        {id: 1, read: false},
        {id: 2, read: false},
        {id: 3, read: false},
      ],
    });
  });

  it('should handle SET_ALL_RESPONSES_EMPTY', () => {
    expect(
      feedbackReducer(initialState, {
        type: SET_ALL_RESPONSES_EMPTY,
      }),
    ).toEqual({
      ...initialState,
      allResponses: [],
    });
  });
});
