import {
  API_ERROR,
  IS_LOADING,
  IS_TICKET_LOADING,
  WANT_TO_RELOAD_DASHBOARD,
} from '../actions';
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
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
} from '../actions/dashboard.actions';
import {
  CX_GET_CLOSED_LOOP_OWNER_DETAILS,
  CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
  CX_GET_CLOSED_LOOP_TICKET_DETAILS,
  CLF_GET_TICKET_DETAILS,
  COMMNETS,
  ACTIVITY_LOG,
  FEEDBACK_API_KEY_ENDPOINT,
  CLF_GET_EMAIL_TEMPLATES,
  CLF_GET_DEFAULT_EMAIL_TEMPLATE,
  CLF_SEND_EMAIL_PREFIX,
  CLF_SEND_EMAIL_POSTFIX,
  CX_GET_CLOSED_LOOP_SEGMENT_AND_OWNER_BY_FEEDBACK,
  CLF_LATEST_COMMENT_BY_TICKET_ID_POSTFIX,
  CLF_LATEST_COMMENT_BY_TICKET_ID_PREFIX,
  CLF_STATUS_HISTORY_BY_PREFIX,
  CLF_STATUS_HISTORY_BY_POSTFIX,
  CLF_UPDATE_ROOT_CAUSE_PREFIX,
  CLF_UPDATE_ROOT_CAUSE_POSTFIX,
  syncTicketList,
  ESCALATE,
  CLF_DELETE_TICKETS,
  CLF_GET_ACTION_HISTORY_PREFIX,
  CLF_GET_ACTION_SUMMARY_POSTFIX,
  CLF_GET_ACTION_DETAILS_POSTFIX,
  CLF_GET_ROOT_CAUSE,
  CLF_GET_ROOT_CAUSE_ACTIONS,
  getClfTicketListUrl,
  CLF_MEDIA_UPLOAD,
} from '../../api/Constant';
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
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';
import {getBearerTokenStatic, getClfUrl} from '../../Utils/ApiCallUtils';
import {
  fetchDetractorTicketDetails,
  watchGetDetractorTicketDetail,
  updateClosedLoopTicket,
  addClosedLoopTicket,
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
  watchUploadFile,
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
} from './ClosedLoopSaga';
// write testcases for closed loop saga

// mock the WebServiceHandler
jest.mock('../../api/WebServiceHandler'); // mock the WebServiceHandler

describe('fetchDetractorTicketDetails saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_DETAILS_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchDetractorTicketDetails(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching ticket details');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchDetractorTicketDetails(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});
// write testcases for closed loop saga
describe('watchGetDetractorTicketDetail saga', () => {
  it('should dispatch GET_CLOSED_LOOP_TICKET_DETAILS on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetDetractorTicketDetail();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching ticket details');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetDetractorTicketDetail();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});
describe('updateClosedLoopTicket saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_RECEIVED on success', async () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = updateClosedLoopTicket(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
        ticketData: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const error = new Error('Error updating ticket');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = updateClosedLoopTicket(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});
// write testcases for closed loop saga
describe('addClosedLoopTicket saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_RECEIVED on success', async () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = addClosedLoopTicket(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
        ticketData: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const error = new Error('Error adding ticket');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = addClosedLoopTicket(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('patchUpdateClfTicket saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_RECEIVED on success', async () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = patchUpdateClfTicket(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
        ticketData: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const error = new Error('Error updating ticket');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = patchUpdateClfTicket(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('patchTicketEscalation saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_RECEIVED on success', async () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = patchTicketEscalation(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
        ticketData: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', body: {ticketID: '123'}};
    const error = new Error('Error updating ticket');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = patchTicketEscalation(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('getEmailTemplates saga', () => {
  it('should dispatch GET_EMAIL_TEMPLATES_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = getEmailTemplates(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_EMAIL_TEMPLATES_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching email templates');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = getEmailTemplates(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('getDefaultEmailTemplate saga', () => {
  it('should dispatch GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = getDefaultEmailTemplate(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching default email template');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = getDefaultEmailTemplate(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('sendEmail saga', () => {
  it('should dispatch SEND_EMAIL_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = sendEmail(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: SEND_EMAIL_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error sending email');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = sendEmail(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('getLatestComment saga', () => {
  it('should dispatch GET_LATEST_COMMENT_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = getLatestComment(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_LATEST_COMMENT_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching latest comment');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = getLatestComment(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('getTicketStatusHistory saga', () => {
  it('should dispatch GET_TICKET_STATUS_HISTORY_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = getTicketStatusHistory(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_TICKET_STATUS_HISTORY_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching ticket status history');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = getTicketStatusHistory(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('getRootCauseList saga', () => {
  it('should dispatch ROOT_CASUES_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = getRootCauseList(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ROOT_CASUES_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching root causes');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = getRootCauseList(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('getRootCauseActionList saga', () => {
  it('should dispatch ACTIONS_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = getRootCauseActionList(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ACTIONS_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching root cause actions');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = getRootCauseActionList(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('updateRootCauseAndAction saga', () => {
  it('should dispatch ROOT_CAUSE_UPDATE_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.patch.mockResolvedValue(response);
    const generator = updateRootCauseAndAction(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ROOT_CAUSE_UPDATE_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error updating root cause and action');
    WebServiceHandler.patch.mockRejectedValue(error);
    const generator = updateRootCauseAndAction(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('deleteTickets saga', () => {
  it('should dispatch DELETE_TICKET_COMPLETE on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.delete.mockResolvedValue(response);
    const generator = deleteTickets(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: DELETE_TICKET_COMPLETE,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error deleting ticket');
    WebServiceHandler.delete.mockRejectedValue(error);
    const generator = deleteTickets(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('fetchActionSummary saga', () => {
  it('should dispatch ACTION_HISTORY_SUMMARY_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchActionSummary(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ACTION_HISTORY_SUMMARY_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching action summary');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchActionSummary(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('fetchActionDetails saga', () => {
  it('should dispatch ACTION_HISTORY_DETAILS_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchActionDetails(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ACTION_HISTORY_DETAILS_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching action details');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchActionDetails(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('uploadMediaFile saga', () => {
  it('should dispatch MEDIA_FILE_UPLOAD_RESPONSE on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postUploadFile.mockResolvedValue(response);
    const generator = uploadMediaFile(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: MEDIA_FILE_UPLOAD_RESPONSE,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error uploading media file');
    WebServiceHandler.postUploadFile.mockRejectedValue(error);
    const generator = uploadMediaFile(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchUploadFile saga', () => {
  it('should dispatch MEDIA_FILE_UPLOAD on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postUploadFile.mockResolvedValue(response);
    const generator = watchUploadFile();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: MEDIA_FILE_UPLOAD,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error uploading media file');
    WebServiceHandler.postUploadFile.mockRejectedValue(error);
    const generator = watchUploadFile();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('syncTickets saga', () => {
  it('should dispatch TICKET_LIST_SYNC_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = syncTickets(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: TICKET_LIST_SYNC_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error syncing tickets');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = syncTickets(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('fetchClosedLoopTicketList saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_LIST_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchClosedLoopTicketList(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_LIST_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching closed loop ticket list');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchClosedLoopTicketList(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('fetchClosedLoopTicketItem saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchClosedLoopTicketItem(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching closed loop ticket item');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchClosedLoopTicketItem(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('fetchClosedLoopTicketComments saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchClosedLoopTicketComments(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching closed loop ticket comments');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchClosedLoopTicketComments(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('fetchClosedLoopTicketActivity saga', () => {
  it('should dispatch CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = fetchClosedLoopTicketActivity(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching closed loop ticket activity');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = fetchClosedLoopTicketActivity(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('postTicketComment saga', () => {
  it('should dispatch ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = postTicketComment(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error posting ticket comment');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = postTicketComment(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('postCreateClfTicket saga', () => {
  it('should dispatch CREATE_CLF_TICKET_RECIEVED on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = postCreateClfTicket(action);
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: CREATE_CLF_TICKET_RECIEVED,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error creating ticket');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = postCreateClfTicket(action);
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchGetEmailTemplates saga', () => {
  it('should dispatch GET_EMAIL_TEMPLATES on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetEmailTemplates();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_EMAIL_TEMPLATES,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching email templates');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetEmailTemplates();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchGetDefaultEmailTemplate saga', () => {
  it('should dispatch GET_DEFAULT_EMAIL_TEMPLATE on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetDefaultEmailTemplate();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_DEFAULT_EMAIL_TEMPLATE,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching default email template');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetDefaultEmailTemplate();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchSendEmail saga', () => {
  it('should dispatch SEND_EMAIL on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.postNew.mockResolvedValue(response);
    const generator = watchSendEmail();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: SEND_EMAIL,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error sending email');
    WebServiceHandler.postNew.mockRejectedValue(error);
    const generator = watchSendEmail();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchGetLatestComment saga', () => {
  it('should dispatch GET_LATEST_COMMENT on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetLatestComment();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_LATEST_COMMENT,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching latest comment');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetLatestComment();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchGetTicketStatusHistory saga', () => {
  it('should dispatch GET_TICKET_STATUS_HISTORY on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetTicketStatusHistory();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: GET_TICKET_STATUS_HISTORY,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching ticket status history');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetTicketStatusHistory();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchGetRootCauseList saga', () => {
  it('should dispatch ROOT_CASUES on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetrootCauseList();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ROOT_CASUES,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching root causes');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetrootCauseList();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchGetRootCauseActionList saga', () => {
  it('should dispatch ACTIONS on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchGetrootCauseActionList();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ACTIONS,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching root cause actions');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchGetrootCauseActionList();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchUpdateRootCause saga', () => {
  it('should dispatch ROOT_CAUSE_UPDATE on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.patch.mockResolvedValue(response);
    const generator = watchUpdateRootCause();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ROOT_CAUSE_UPDATE,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error updating root cause and action');
    WebServiceHandler.patch.mockRejectedValue(error);
    const generator = watchUpdateRootCause();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchDeleteTickets saga', () => {
  it('should dispatch DELETE_TICKET on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.delete.mockResolvedValue(response);
    const generator = watchDeleteTickets();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: DELETE_TICKET,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error deleting ticket');
    WebServiceHandler.delete.mockRejectedValue(error);
    const generator = watchDeleteTickets();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchActionSummary saga', () => {
  it('should dispatch ACTION_HISTORY_SUMMARY on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchActionSummary();
    generator.next(); // Skip to the API call
    expect(generator.next(response).value).toEqual(
      put({
        type: ACTION_HISTORY_SUMMARY,
        response: response,
      }),
    );
  });
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching action summary');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchActionSummary();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value;
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});

describe('watchActionDetails saga', () => {
  it('should dispatch ACTION_HISTORY_DETAILS on success', async () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const response = {success: true}; // Replace with actual response
    WebServiceHandler.get.mockResolvedValue(response);
    const generator = watchActionDetails();
    generator.next(); // Skip to the API call
    const responseYield = generator.next(response).value;
    console.log('responseYield', JSON.stringify(responseYield));
    expect(responseYield.payload.type).toEqual(ACTION_HISTORY_DETAILS);
  });
  // test for failure
  it('should dispatch API_ERROR on failure', () => {
    const action = {token: 'token', param: {ticketID: '123'}};
    const error = new Error('Error fetching action details');
    WebServiceHandler.get.mockRejectedValue(error);
    const generator = watchActionDetails();
    generator.next(); // Skip to the API call
    const responseYield = generator.throw(error).value; // Throw the error
    expect(responseYield.payload.type).toEqual(API_ERROR);
  });
});
