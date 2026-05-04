import {runSaga} from 'redux-saga';
import {put, takeLatest} from 'redux-saga/effects';
import {
  API_ERROR,
  IS_LOADING,
  IS_TICKET_LOADING,
  WANT_TO_RELOAD_DASHBOARD,
} from '../actions';
import {
  CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
  CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_ITEM_RECEIVED,
  CLOSED_LOOP_TICKET_LIST_RECEIVED,
  GET_CLOSED_LOOP_OWNER_DETAILS,
  GET_CLOSED_LOOP_SEGMENT_DETAILS,
  GET_CLOSED_LOOP_TICKET_DETAILS,
  GET_CLOSED_LOOP_TICKET_ITEM,
  GET_CLOSED_LOOP_TICKET_LIST,
  GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
  GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,
  CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
  CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
  ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
  ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
  CREATE_CLF_TICKET_RECIEVED,
  CREATE_CLF_TICKET,
  UPDATE_CLF_TICKET_RECIEVED,
  UPDATE_CLF_TICKET,
  CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED,
  GET_CLOSED_LOOP_ALL_OWNERS_DETAILS,
  FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
  SET_TOKEN_EXPIRED,
} from '../actions/dashboard.actions';
import {
  ACTIONS_RECEIVED,
  ACTION_HISTORY_DETAILS,
  ACTION_HISTORY_DETAILS_RECEIVED,
  ACTION_HISTORY_SUMMARY,
  ACTION_HISTORY_SUMMARY_RECEIVED,
  DELETE_TICKET,
  DELETE_TICKET_COMPLETE,
  GET_ACTIONS,
  GET_DEFAULT_EMAIL_TEMPLATE,
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES,
  GET_EMAIL_TEMPLATES_RECEIVED,
  GET_LATEST_COMMENT,
  GET_ROOT_CASUES,
  GET_TICKET_LIST_SYNC,
  GET_TICKET_LIST_SYNC_RECEIVED,
  GET_TICKET_STATUS_HISTORY,
  GET_TICKET_STATUS_HISTORY_RECEIVED,
  LATEST_COMMENT_RECEIVED,
  MEDIA_FILE_UPLOAD,
  MEDIA_FILE_UPLOAD_RESET,
  MEDIA_FILE_UPLOAD_RESPONSE,
  ROOT_CASUES_RECEIVED,
  ROOT_CAUSE_UPDATE_RECEIVED,
  SEND_EMAIL,
  SEND_EMAIL_RECEIVED,
  TICKET_ESCALATION_RECIEVED,
  UPDATE_ROOT_CAUSE,
  UPDATE_TICKET_ESCALATION,
} from '../actions/closedloop.actions';
import {
  fetchDetractorTicketDetails,
  fetchFirstTimeClosedLoopSegmentDetails,
  fetchClosedLoopSegmentDetails,
  fetchClosedLoopOwnerDetails,
  fetchClosedLoopAllOwners,
  syncTickets,
  fetchClosedLoopTicketList,
  fetchClosedLoopTicketItem,
  fetchClosedLoopTicketComments,
  fetchClosedLoopTicketActivity,
  postTicketComment,
  postCreateClfTicket,
  patchUpdateClfTicket,
  patchTicketEscalation,
  getEmailTemplates,
  getDefaultEmailTemplate,
  sendEmail,
  getLatestComment,
  getTicketStatusHistory,
  getRootCauseList,
  getRootCauseActionList,
  updateRootCauseAndAction,
  deleteTickets,
  fetchActionSummary,
  fetchActionDetails,
  uploadMediaFile,
} from './ClosedLoopSaga';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';
import {getBearerTokenStatic, getClfUrl} from '../../Utils/ApiCallUtils';

jest.mock('../../api/WebServiceHandler');
jest.mock('../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
  showSuccessFlashMessage: jest.fn(),
}));
jest.mock('../../Utils/ApiCallUtils', () => ({
  getBearerTokenStatic: jest.fn(),
  getClfUrl: jest.fn(url => url),
}));

describe('ClosedLoop Sagas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchDetractorTicketDetails saga', () => {
    it('should dispatch CLOSED_LOOP_TICKET_DETAILS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {tickets: []}, statusCode: 200};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchDetractorTicketDetails,
        {
          token: 'dummy-token',
          param: {ticketID: '123'},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: true}},
        {type: CLOSED_LOOP_TICKET_DETAILS_RECEIVED, response: mockResponse},
        {type: IS_LOADING, payload: {isLoading: false}},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchDetractorTicketDetails,
        {
          token: 'dummy-token',
          param: {ticketID: '123'},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: true}},
        {type: IS_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('fetchFirstTimeClosedLoopSegmentDetails saga', () => {
    it('should dispatch FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {segments: []}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchFirstTimeClosedLoopSegmentDetails,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
          response: mockResponse,
        },
        {type: IS_LOADING, payload: {isLoading: false}},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchFirstTimeClosedLoopSegmentDetails,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('fetchClosedLoopSegmentDetails saga', () => {
    it('should dispatch CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {segments: []}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopSegmentDetails,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED, response: mockResponse},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopSegmentDetails,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('fetchClosedLoopOwnerDetails saga', () => {
    it('should dispatch CLOSED_LOOP_OWNER_DETAILS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {owners: []}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopOwnerDetails,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: CLOSED_LOOP_OWNER_DETAILS_RECEIVED, response: mockResponse},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopOwnerDetails,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('fetchClosedLoopAllOwners saga', () => {
    it('should dispatch CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {owners: []}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopAllOwners,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED, response: mockResponse},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopAllOwners,
        {
          token: 'dummy-token',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('syncTickets saga', () => {
    it('should dispatch GET_TICKET_LIST_SYNC_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [], hasNextCall: false};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        syncTickets,
        {
          feedbackID: 'feedback-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: GET_TICKET_LIST_SYNC_RECEIVED, response: mockResponse},
      ]);
    });

    it('should handle jwt expired error gracefully', async () => {
      const dispatched = [];
      const mockError = new Error('jwt expired');

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        syncTickets,
        {
          feedbackID: 'feedback-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: SET_TOKEN_EXPIRED, isTokenExpired: true},
      ]);
    });
  });

  describe('fetchClosedLoopTicketList saga', () => {
    it('should dispatch CLOSED_LOOP_TICKET_LIST_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {tickets: []}};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketList,
        {
          feedbackId: 'feedback-123',
          segmentId: 'segment-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {type: CLOSED_LOOP_TICKET_LIST_RECEIVED, response: mockResponse},
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketList,
        {
          feedbackId: 'feedback-123',
          segmentId: 'segment-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('fetchClosedLoopTicketItem saga', () => {
    it('should dispatch CLOSED_LOOP_TICKET_ITEM_RECEIVED on success', async () => {
      const dispatched = [];
      const mockTicketItem = {data: {id: '1'}};
      const mockComments = {data: [{id: '1', comment: 'test'}]};
      const mockActivity = {data: [{id: '1', activity: 'test'}]};

      WebServiceHandler.get
        .mockResolvedValueOnce(mockTicketItem)
        .mockResolvedValueOnce(mockComments)
        .mockResolvedValueOnce(mockActivity);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketItem,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {
          type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
          ticketData: mockTicketItem.data,
          ticketComments: mockComments.data,
          ticketActivity: mockActivity.data,
        },
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketItem,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('fetchClosedLoopTicketComments saga', () => {
    it('should dispatch CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [{id: '1', comment: 'test'}]};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketComments,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
          ticketComments: mockResponse.data,
        },
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketComments,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('fetchClosedLoopTicketActivity saga', () => {
    it('should dispatch CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [{id: '1', activity: 'test'}]};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketActivity,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
          ticketActivity: mockResponse.data,
        },
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClosedLoopTicketActivity,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('postCreateClfTicket saga', () => {
    it('should dispatch CREATE_CLF_TICKET_RECIEVED on success', async () => {
      const dispatched = [];
      const mockResponse = {status: 'success', data: {id: '123'}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        postCreateClfTicket,
        {
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: CREATE_CLF_TICKET_RECIEVED, response: mockResponse},
        {type: WANT_TO_RELOAD_DASHBOARD, payload: {wantToReload: true}},
        {type: IS_LOADING, payload: {isLoading: false}},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        postCreateClfTicket,
        {
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('patchUpdateClfTicket saga', () => {
    it('should dispatch UPDATE_CLF_TICKET_RECIEVED on success', async () => {
      const dispatched = [];
      const mockTicketItem = {data: {id: '1'}, message: 'Updated successfully'};
      const mockComments = {data: [{id: '1', comment: 'test'}]};
      const mockActivity = {data: [{id: '1', activity: 'test'}]};

      WebServiceHandler.patch.mockResolvedValue(mockTicketItem);
      WebServiceHandler.get
        .mockResolvedValueOnce(mockComments)
        .mockResolvedValueOnce(mockActivity);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        patchUpdateClfTicket,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {
          type: UPDATE_CLF_TICKET_RECIEVED,
          ticketData: mockTicketItem.data,
          ticketComments: mockComments.data,
          ticketActivity: mockActivity.data,
        },
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
      ]);
      expect(showSuccessFlashMessage).toHaveBeenCalledWith(
        mockTicketItem.message,
      );
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.patch.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        patchUpdateClfTicket,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {type: IS_TICKET_LOADING, payload: {isLoading: false}},
        {type: API_ERROR, error: mockError},
      ]);
    });
  });

  describe('getEmailTemplates saga', () => {
    it('should dispatch GET_EMAIL_TEMPLATES_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [{id: '1', template: 'test'}]};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getEmailTemplates,
        {
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: GET_EMAIL_TEMPLATES_RECEIVED, response: mockResponse.data},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getEmailTemplates,
        {
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('sendEmail saga', () => {
    it('should dispatch SEND_EMAIL_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {message: 'Email sent successfully'};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        sendEmail,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: SEND_EMAIL_RECEIVED, response: mockResponse},
        {type: MEDIA_FILE_UPLOAD_RESET, response: []},
      ]);
      expect(showSuccessFlashMessage).toHaveBeenCalledWith(
        mockResponse.message,
      );
    });

    it('should show error flash message on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error sending email'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        sendEmail,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([]);
      expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.message);
    });
  });

  describe('getRootCauseList saga', () => {
    it('should dispatch ROOT_CASUES_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [{id: '1', cause: 'test'}]};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getRootCauseList,
        {},
      ).toPromise();

      expect(dispatched).toEqual([
        {type: ROOT_CASUES_RECEIVED, response: mockResponse.data},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getRootCauseList,
        {},
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('getRootCauseActionList saga', () => {
    it('should dispatch ACTIONS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [{id: '1', action: 'test'}]};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getRootCauseActionList,
        {},
      ).toPromise();

      expect(dispatched).toEqual([
        {type: ACTIONS_RECEIVED, response: mockResponse.data},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getRootCauseActionList,
        {},
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('updateRootCauseAndAction saga', () => {
    it('should dispatch ROOT_CAUSE_UPDATE_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {
        data: {updated: true},
        message: 'Updated successfully',
      };
      const mockTicketItem = {data: {id: '1'}};

      WebServiceHandler.patch.mockResolvedValue(mockResponse);
      WebServiceHandler.get.mockResolvedValue(mockTicketItem);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        updateRootCauseAndAction,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: ROOT_CAUSE_UPDATE_RECEIVED,
          response: mockResponse.data,
          ticketData: mockTicketItem.data,
        },
      ]);
      expect(showSuccessFlashMessage).toHaveBeenCalledWith(
        mockResponse.message,
      );
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.patch.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        updateRootCauseAndAction,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
      expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.message);
    });
  });

  describe('deleteTickets saga', () => {
    it('should dispatch DELETE_TICKET_COMPLETE on success', async () => {
      const dispatched = [];
      const mockResponse = {message: 'Tickets deleted successfully'};

      WebServiceHandler.delete.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        deleteTickets,
        {
          param: {ticketIds: ['1', '2']},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: DELETE_TICKET_COMPLETE, response: mockResponse},
      ]);
      expect(showSuccessFlashMessage).toHaveBeenCalledWith(
        mockResponse.message,
      );
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.delete.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        deleteTickets,
        {
          param: {ticketIds: ['1', '2']},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
      expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.message);
    });
  });

  describe('fetchActionSummary saga', () => {
    it('should dispatch ACTION_HISTORY_SUMMARY_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {summary: 'test'}};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchActionSummary,
        {
          ticketId: 'ticket-123',
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: ACTION_HISTORY_SUMMARY_RECEIVED, response: mockResponse},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchActionSummary,
        {
          ticketId: 'ticket-123',
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('fetchActionDetails saga', () => {
    it('should dispatch ACTION_HISTORY_DETAILS_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {details: 'test'}};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchActionDetails,
        {
          ticketId: 'ticket-123',
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: ACTION_HISTORY_DETAILS_RECEIVED, response: mockResponse},
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.get.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchActionDetails,
        {
          ticketId: 'ticket-123',
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('uploadMediaFile saga', () => {
    it('should dispatch MEDIA_FILE_UPLOAD_RESPONSE on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {fileId: '123'}};

      WebServiceHandler.postUploadFile.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        uploadMediaFile,
        {
          param: {file: 'test-file'},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: MEDIA_FILE_UPLOAD_RESPONSE, response: mockResponse},
      ]);
    });

    it('should handle error gracefully', async () => {
      const dispatched = [];
      const mockError = {message: 'Error occurred'};

      WebServiceHandler.postUploadFile.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        uploadMediaFile,
        {
          param: {file: 'test-file'},
        },
      ).toPromise();

      expect(dispatched).toEqual([]);
    });
  });
});
