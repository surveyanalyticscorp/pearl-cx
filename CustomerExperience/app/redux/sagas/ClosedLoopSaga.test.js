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
  CENTRALIZED_ROOT_CAUSE_RECEIVED,
  GET_CENTRALIZED_ROOT_CAUSE,
  CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED,
  UPDATE_CENTRALIZED_ROOT_CAUSE,
  CENTRALIZED_ROOT_CAUSE,
  GENERATE_EMAIL_DRAFT,
  GENERATE_EMAIL_DRAFT_RECEIVED,
  GENERATE_REFINE_EMAIL_DRAFT,
  GENERATE_REFINE_EMAIL_DRAFT_RECEIVED,
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
  // Utility functions
  updateClosedLoopTicket,
  addClosedLoopTicket,
  // Additional sagas
  getCentralizedRootCause,
  updateCentralizedRootCause,
  generateEmailDraft,
  generateRefinedEmailDraft,
  // Watcher functions
  watchGetDetractorTicketDetail,
  watchGetFirstTimeClosedLoopSegmentDetails,
  watchGetClosedLoopSegmentDetails,
  watchGetClosedLoopOwnerDetails,
  watchGetClosedLoopAllOwners,
  watchSyncTickets,
  watchGetClosedLoopTicketList,
  watchGetClosedLoopTicketItem,
  watchGetClosedLoopTicketComments,
  watchGetClosedLoopTicketActivity,
  watchPostTicketComment,
  watchPostCreateTicket,
  watchPatchUpdateTicket,
  watchTicketEscalation,
  watchGetEmailTemplates,
  watchGetDefaultEmailTemplate,
  watchSendEmail,
  watchGetLatestComment,
  watchGetTicketStatusHistory,
  watchGetrootCauseList,
  watchGetrootCauseActionList,
  watchUpdateRootCause,
  watchDeleteTickets,
  watchActionSummary,
  watchActionDetails,
  watchUploadFile,
  watchGetCentralizdRootCause,
  watchUpdateCentralizedRootCause,
  watchGenrateEmailDraft,
  watchGenerateRefinedEmailDraft,
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
      const mockError = {message: 'jwt expired'};

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

  describe('postTicketComment saga', () => {
    it('should handle comment posting and update ticket data on success', async () => {
      const dispatched = [];
      const mockCommentResponse = {data: {id: '1', comment: 'New comment'}};
      const mockComments = {data: [{id: '1', comment: 'test'}]};
      const mockTicketItem = {data: {id: '1'}};
      const mockActivity = {data: [{id: '1', activity: 'test'}]};

      WebServiceHandler.postNew.mockResolvedValue(mockCommentResponse);
      WebServiceHandler.get
        .mockResolvedValueOnce(mockComments)
        .mockResolvedValueOnce(mockTicketItem)
        .mockResolvedValueOnce(mockActivity);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        postTicketComment,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
          response: mockCommentResponse,
        },
        {
          type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
          ticketComments: mockComments.data,
        },
        {
          type: UPDATE_CLF_TICKET_RECIEVED,
          ticketData: mockTicketItem.data,
          ticketComments: mockComments.data,
          ticketActivity: mockActivity.data,
        },
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
        postTicketComment,
        {
          ticketId: 'ticket-123',
          feedbackApiKey: 'api-key',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('patchTicketEscalation saga', () => {
    it('should dispatch TICKET_ESCALATION_RECIEVED on success', async () => {
      const dispatched = [];
      const mockTicketItem = {
        data: {escalated: true},
        message: 'Escalated successfully',
      };
      const mockActivity = {data: [{id: '1', activity: 'test'}]};

      WebServiceHandler.patch.mockResolvedValue(mockTicketItem);
      WebServiceHandler.get.mockResolvedValue(mockActivity);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        patchTicketEscalation,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_TICKET_LOADING, payload: {isLoading: true}},
        {
          type: TICKET_ESCALATION_RECIEVED,
          ticketData: mockTicketItem.data,
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
        patchTicketEscalation,
        {
          ticketId: 'ticket-123',
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

  describe('getDefaultEmailTemplate saga', () => {
    it('should dispatch GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {template: 'default template'}};

      // Clear any previous mock calls
      WebServiceHandler.get.mockClear();
      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getDefaultEmailTemplate,
        {
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
          response: mockResponse.data,
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
        getDefaultEmailTemplate,
        {
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('getLatestComment saga', () => {
    it('should dispatch LATEST_COMMENT_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: {comment: 'Latest comment'}};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getLatestComment,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: LATEST_COMMENT_RECEIVED, response: mockResponse.data},
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
        getLatestComment,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('getTicketStatusHistory saga', () => {
    it('should dispatch GET_TICKET_STATUS_HISTORY_RECEIVED on success', async () => {
      const dispatched = [];
      const mockResponse = {data: [{status: 'open', date: '2023-01-01'}]};

      WebServiceHandler.get.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getTicketStatusHistory,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {type: GET_TICKET_STATUS_HISTORY_RECEIVED, response: mockResponse.data},
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
        getTicketStatusHistory,
        {
          ticketId: 'ticket-123',
          param: {},
        },
      ).toPromise();

      expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
    });
  });

  describe('syncTickets saga - additional scenarios', () => {
    it('should handle ticketsHttpException error gracefully', async () => {
      const dispatched = [];
      const mockError = {message: 'ticketsHttpException occurred'};

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

      expect(dispatched).toEqual([]);
    });

    it('should handle hasNextCall=true scenario with multiple calls', async () => {
      const dispatched = [];
      const mockResponse1 = {data: ['ticket1'], hasNextCall: true};
      const mockResponse2 = {data: ['ticket2'], hasNextCall: false};

      WebServiceHandler.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

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
        {type: GET_TICKET_LIST_SYNC_RECEIVED, response: mockResponse2},
      ]);
      expect(WebServiceHandler.get).toHaveBeenCalledTimes(2);
    });

    it('should handle other errors gracefully', async () => {
      const dispatched = [];
      const mockError = {message: 'Network error'};

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

      expect(dispatched).toEqual([]);
    });
  });

  describe('Watcher Functions', () => {
    describe('watchGetDetractorTicketDetail', () => {
      it('should watch GET_CLOSED_LOOP_TICKET_DETAILS and call fetchDetractorTicketDetails', () => {
        const generator = watchGetDetractorTicketDetail();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_CLOSED_LOOP_TICKET_DETAILS,
            fetchDetractorTicketDetails,
          ),
        );
      });
    });

    describe('watchGetFirstTimeClosedLoopSegmentDetails', () => {
      it('should watch GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS and call fetchFirstTimeClosedLoopSegmentDetails', () => {
        const generator = watchGetFirstTimeClosedLoopSegmentDetails();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
            fetchFirstTimeClosedLoopSegmentDetails,
          ),
        );
      });
    });

    describe('watchGetClosedLoopSegmentDetails', () => {
      it('should watch GET_CLOSED_LOOP_SEGMENT_DETAILS and call fetchClosedLoopSegmentDetails', () => {
        const generator = watchGetClosedLoopSegmentDetails();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_CLOSED_LOOP_SEGMENT_DETAILS,
            fetchClosedLoopSegmentDetails,
          ),
        );
      });
    });

    describe('watchGetClosedLoopOwnerDetails', () => {
      it('should watch GET_CLOSED_LOOP_OWNER_DETAILS and call fetchClosedLoopOwnerDetails', () => {
        const generator = watchGetClosedLoopOwnerDetails();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_CLOSED_LOOP_OWNER_DETAILS,
            fetchClosedLoopOwnerDetails,
          ),
        );
      });
    });

    describe('watchGetClosedLoopAllOwners', () => {
      it('should watch GET_CLOSED_LOOP_ALL_OWNERS_DETAILS and call fetchClosedLoopAllOwners', () => {
        const generator = watchGetClosedLoopAllOwners();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_CLOSED_LOOP_ALL_OWNERS_DETAILS,
            fetchClosedLoopAllOwners,
          ),
        );
      });
    });

    describe('watchSyncTickets', () => {
      it('should watch GET_TICKET_LIST_SYNC and call syncTickets', () => {
        const generator = watchSyncTickets();
        expect(generator.next().value).toEqual(
          takeLatest(GET_TICKET_LIST_SYNC, syncTickets),
        );
      });
    });

    describe('watchGetClosedLoopTicketList', () => {
      it('should watch GET_CLOSED_LOOP_TICKET_LIST and call fetchClosedLoopTicketList', () => {
        const generator = watchGetClosedLoopTicketList();
        expect(generator.next().value).toEqual(
          takeLatest(GET_CLOSED_LOOP_TICKET_LIST, fetchClosedLoopTicketList),
        );
      });
    });

    describe('watchGetClosedLoopTicketItem', () => {
      it('should watch GET_CLOSED_LOOP_TICKET_ITEM and call fetchClosedLoopTicketItem', () => {
        const generator = watchGetClosedLoopTicketItem();
        expect(generator.next().value).toEqual(
          takeLatest(GET_CLOSED_LOOP_TICKET_ITEM, fetchClosedLoopTicketItem),
        );
      });
    });

    describe('watchGetClosedLoopTicketComments', () => {
      it('should watch GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS and call fetchClosedLoopTicketComments', () => {
        const generator = watchGetClosedLoopTicketComments();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
            fetchClosedLoopTicketComments,
          ),
        );
      });
    });

    describe('watchGetClosedLoopTicketActivity', () => {
      it('should watch GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY and call fetchClosedLoopTicketActivity', () => {
        const generator = watchGetClosedLoopTicketActivity();
        expect(generator.next().value).toEqual(
          takeLatest(
            GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,
            fetchClosedLoopTicketActivity,
          ),
        );
      });
    });

    describe('watchPostTicketComment', () => {
      it('should watch ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS and call postTicketComment', () => {
        const generator = watchPostTicketComment();
        expect(generator.next().value).toEqual(
          takeLatest(ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS, postTicketComment),
        );
      });
    });

    describe('watchPostCreateTicket', () => {
      it('should watch CREATE_CLF_TICKET and call postCreateClfTicket', () => {
        const generator = watchPostCreateTicket();
        expect(generator.next().value).toEqual(
          takeLatest(CREATE_CLF_TICKET, postCreateClfTicket),
        );
      });
    });

    describe('watchPatchUpdateTicket', () => {
      it('should watch UPDATE_CLF_TICKET and call patchUpdateClfTicket', () => {
        const generator = watchPatchUpdateTicket();
        expect(generator.next().value).toEqual(
          takeLatest(UPDATE_CLF_TICKET, patchUpdateClfTicket),
        );
      });
    });

    describe('watchTicketEscalation', () => {
      it('should watch UPDATE_TICKET_ESCALATION and call patchTicketEscalation', () => {
        const generator = watchTicketEscalation();
        expect(generator.next().value).toEqual(
          takeLatest(UPDATE_TICKET_ESCALATION, patchTicketEscalation),
        );
      });
    });

    describe('watchGetEmailTemplates', () => {
      it('should watch GET_EMAIL_TEMPLATES and call getEmailTemplates', () => {
        const generator = watchGetEmailTemplates();
        expect(generator.next().value).toEqual(
          takeLatest(GET_EMAIL_TEMPLATES, getEmailTemplates),
        );
      });
    });

    describe('watchGetDefaultEmailTemplate', () => {
      it('should watch GET_DEFAULT_EMAIL_TEMPLATE and call getDefaultEmailTemplate', () => {
        const generator = watchGetDefaultEmailTemplate();
        expect(generator.next().value).toEqual(
          takeLatest(GET_DEFAULT_EMAIL_TEMPLATE, getDefaultEmailTemplate),
        );
      });
    });

    describe('watchSendEmail', () => {
      it('should watch SEND_EMAIL and call sendEmail', () => {
        const generator = watchSendEmail();
        expect(generator.next().value).toEqual(
          takeLatest(SEND_EMAIL, sendEmail),
        );
      });
    });

    describe('watchGetLatestComment', () => {
      it('should watch GET_LATEST_COMMENT and call getLatestComment', () => {
        const generator = watchGetLatestComment();
        expect(generator.next().value).toEqual(
          takeLatest(GET_LATEST_COMMENT, getLatestComment),
        );
      });
    });

    describe('watchGetTicketStatusHistory', () => {
      it('should watch GET_TICKET_STATUS_HISTORY and call getTicketStatusHistory', () => {
        const generator = watchGetTicketStatusHistory();
        expect(generator.next().value).toEqual(
          takeLatest(GET_TICKET_STATUS_HISTORY, getTicketStatusHistory),
        );
      });
    });

    describe('watchGetrootCauseList', () => {
      it('should watch GET_ROOT_CASUES and call getRootCauseList', () => {
        const generator = watchGetrootCauseList();
        expect(generator.next().value).toEqual(
          takeLatest(GET_ROOT_CASUES, getRootCauseList),
        );
      });
    });

    describe('watchGetrootCauseActionList', () => {
      it('should watch GET_ACTIONS and call getRootCauseActionList', () => {
        const generator = watchGetrootCauseActionList();
        expect(generator.next().value).toEqual(
          takeLatest(GET_ACTIONS, getRootCauseActionList),
        );
      });
    });

    describe('watchUpdateRootCause', () => {
      it('should watch UPDATE_ROOT_CAUSE and call updateRootCauseAndAction', () => {
        const generator = watchUpdateRootCause();
        expect(generator.next().value).toEqual(
          takeLatest(UPDATE_ROOT_CAUSE, updateRootCauseAndAction),
        );
      });
    });

    describe('watchDeleteTickets', () => {
      it('should watch DELETE_TICKET and call deleteTickets', () => {
        const generator = watchDeleteTickets();
        expect(generator.next().value).toEqual(
          takeLatest(DELETE_TICKET, deleteTickets),
        );
      });
    });

    describe('watchActionSummary', () => {
      it('should watch ACTION_HISTORY_SUMMARY and call fetchActionSummary', () => {
        const generator = watchActionSummary();
        expect(generator.next().value).toEqual(
          takeLatest(ACTION_HISTORY_SUMMARY, fetchActionSummary),
        );
      });
    });

    describe('watchActionDetails', () => {
      it('should watch ACTION_HISTORY_DETAILS and call fetchActionDetails', () => {
        const generator = watchActionDetails();
        expect(generator.next().value).toEqual(
          takeLatest(ACTION_HISTORY_DETAILS, fetchActionDetails),
        );
      });
    });

    describe('watchUploadFile', () => {
      it('should watch MEDIA_FILE_UPLOAD and call uploadMediaFile', () => {
        const generator = watchUploadFile();
        expect(generator.next().value).toEqual(
          takeLatest(MEDIA_FILE_UPLOAD, uploadMediaFile),
        );
      });
    });
  });

  describe('Additional Saga Functions', () => {
    describe('getCentralizedRootCause saga', () => {
      it('should dispatch CENTRALIZED_ROOT_CAUSE_RECEIVED on success', async () => {
        const dispatched = [];
        const mockResponse = {data: [{id: '1', cause: 'centralized test'}]};

        WebServiceHandler.get.mockResolvedValue(mockResponse);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          getCentralizedRootCause,
          {},
        ).toPromise();

        expect(dispatched).toEqual([
          {type: CENTRALIZED_ROOT_CAUSE_RECEIVED, response: mockResponse.data},
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
          getCentralizedRootCause,
          {},
        ).toPromise();

        expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
      });
    });

    describe('updateCentralizedRootCause saga', () => {
      it('should dispatch CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED on success', async () => {
        const dispatched = [];
        const mockResponse = {
          status: 'success',
          message: 'Updated successfully',
        };

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          updateCentralizedRootCause,
          {
            ticketId: 'ticket-123',
            param: {},
          },
        ).toPromise();

        expect(dispatched).toEqual([
          {
            type: CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED,
            response: mockResponse,
          },
        ]);
        expect(showSuccessFlashMessage).toHaveBeenCalledWith(
          'Updated successfully',
        );
      });

      it('should dispatch API_ERROR on failure', async () => {
        const dispatched = [];
        const mockError = {message: 'Error occurred'};

        WebServiceHandler.postNew.mockRejectedValue(mockError);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          updateCentralizedRootCause,
          {
            ticketId: 'ticket-123',
            param: {},
          },
        ).toPromise();

        expect(dispatched).toEqual([{type: API_ERROR, error: mockError}]);
        expect(showErrorFlashMessage).toHaveBeenCalledWith('Error occurred');
      });
    });

    describe('generateEmailDraft saga', () => {
      it('should dispatch GENERATE_EMAIL_DRAFT_RECEIVED on success', async () => {
        const dispatched = [];
        const mockResponse = {
          status: 'success',
          data: {draft: 'email content'},
        };

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          generateEmailDraft,
          {
            ticketId: 'ticket-123',
            feedbackId: 'feedback-123',
            param: {},
          },
        ).toPromise();

        expect(dispatched).toEqual([
          {type: GENERATE_EMAIL_DRAFT_RECEIVED, response: mockResponse.data},
        ]);
      });

      it('should handle error gracefully', async () => {
        const dispatched = [];
        const mockError = {message: 'Error occurred'};

        WebServiceHandler.postNew.mockRejectedValue(mockError);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          generateEmailDraft,
          {
            ticketId: 'ticket-123',
            feedbackId: 'feedback-123',
            param: {},
          },
        ).toPromise();

        expect(dispatched).toEqual([]);
      });
    });

    describe('generateRefinedEmailDraft saga', () => {
      it('should dispatch GENERATE_REFINE_EMAIL_DRAFT_RECEIVED on success', async () => {
        const dispatched = [];
        const mockResponse = {
          status: 'success',
          data: {refined: 'refined email'},
        };

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          generateRefinedEmailDraft,
          {
            param: {},
          },
        ).toPromise();

        expect(dispatched).toEqual([
          {
            type: GENERATE_REFINE_EMAIL_DRAFT_RECEIVED,
            response: mockResponse.data,
          },
        ]);
      });

      it('should handle error gracefully', async () => {
        const dispatched = [];
        const mockError = {message: 'Error occurred'};

        WebServiceHandler.postNew.mockRejectedValue(mockError);

        await runSaga(
          {
            dispatch: action => dispatched.push(action),
          },
          generateRefinedEmailDraft,
          {
            param: {},
          },
        ).toPromise();

        expect(dispatched).toEqual([]);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('updateClosedLoopTicket', () => {
      it('should call success callback on successful update', done => {
        const mockResponse = {body: {data: 'success'}};
        const successCallback = jest.fn(data => {
          expect(data).toEqual(mockResponse.body);
          done();
        });
        const errorCallback = jest.fn();

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        updateClosedLoopTicket('token', {}, successCallback, errorCallback);
      });

      it('should call error callback on API error', done => {
        const mockResponse = {body: {Error: 'Something went wrong'}};
        const successCallback = jest.fn();
        const errorCallback = jest.fn(error => {
          expect(error).toBe('Something went wrong');
          done();
        });

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        updateClosedLoopTicket('token', {}, successCallback, errorCallback);
      });

      it('should call error callback on network error', done => {
        const mockError = {errorAlert: 'Network error'};
        const successCallback = jest.fn();
        const errorCallback = jest.fn(error => {
          expect(error).toBe('Network error');
          done();
        });

        WebServiceHandler.postNew.mockRejectedValue(mockError);

        updateClosedLoopTicket('token', {}, successCallback, errorCallback);
      });
    });

    describe('addClosedLoopTicket', () => {
      it('should call success callback on successful creation', done => {
        const mockResponse = {body: {data: 'success'}};
        const successCallback = jest.fn(data => {
          expect(data).toEqual(mockResponse.body);
          done();
        });
        const errorCallback = jest.fn();

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        addClosedLoopTicket('token', {}, successCallback, errorCallback);
      });

      it('should call error callback on API error', done => {
        const mockResponse = {body: {Error: 'Creation failed'}};
        const successCallback = jest.fn();
        const errorCallback = jest.fn(error => {
          expect(error).toBe('Creation failed');
          done();
        });

        WebServiceHandler.postNew.mockResolvedValue(mockResponse);

        addClosedLoopTicket('token', {}, successCallback, errorCallback);
      });

      it('should call error callback on network error', done => {
        const mockError = {errorAlert: 'Network error'};
        const successCallback = jest.fn();
        const errorCallback = jest.fn(error => {
          expect(error).toBe('Network error');
          done();
        });

        WebServiceHandler.postNew.mockRejectedValue(mockError);

        addClosedLoopTicket('token', {}, successCallback, errorCallback);
      });
    });
  });

  describe('Additional Watcher Functions', () => {
    describe('watchUpdateCentralizedRootCause', () => {
      it('should watch UPDATE_CENTRALIZED_ROOT_CAUSE and call updateCentralizedRootCause', () => {
        const generator = watchUpdateCentralizedRootCause();
        expect(generator.next().value).toEqual(
          takeLatest(UPDATE_CENTRALIZED_ROOT_CAUSE, updateCentralizedRootCause),
        );
      });
    });

    describe('watchGenrateEmailDraft', () => {
      it('should watch GENERATE_EMAIL_DRAFT and call generateEmailDraft', () => {
        const generator = watchGenrateEmailDraft();
        expect(generator.next().value).toEqual(
          takeLatest(GENERATE_EMAIL_DRAFT, generateEmailDraft),
        );
      });
    });

    describe('watchGenerateRefinedEmailDraft', () => {
      it('should watch GENERATE_REFINE_EMAIL_DRAFT and call generateRefinedEmailDraft', () => {
        const generator = watchGenerateRefinedEmailDraft();
        expect(generator.next().value).toEqual(
          takeLatest(GENERATE_REFINE_EMAIL_DRAFT, generateRefinedEmailDraft),
        );
      });
    });

    describe('watchGetCentralizdRootCause', () => {
      it('should watch CENTRALIZED_ROOT_CAUSE and call getCentralizedRootCause', () => {
        const generator = watchGetCentralizdRootCause();
        expect(generator.next().value).toEqual(
          takeLatest(CENTRALIZED_ROOT_CAUSE, getCentralizedRootCause),
        );
      });
    });
  });
});
