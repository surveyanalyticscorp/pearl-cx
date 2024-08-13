import * as actions from './closedloop.actions';
import {
  GET_TICKET_LIST_SYNC,
  GET_TICKET_LIST_SYNC_RECEIVED,
  CLEAR_TICKET_SYNC,
  GET_DEFAULT_EMAIL_TEMPLATE,
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES,
  GET_EMAIL_TEMPLATES_RECEIVED,
  SEND_EMAIL,
  SEND_EMAIL_RECEIVED,
  GET_LATEST_COMMENT,
  LATEST_COMMENT_RECEIVED,
  GET_TICKET_STATUS_HISTORY,
  GET_TICKET_STATUS_HISTORY_RECEIVED,
  SET_TICKET_FILTER_BY_STATUS_ID,
  GET_ROOT_CASUES,
  ROOT_CASUES_RECEIVED,
  GET_ACTIONS,
  ACTIONS_RECEIVED,
  UPDATE_ROOT_CAUSE,
  ROOT_CAUSE_UPDATE_RECEIVED,
  UPDATE_TICKET_ESCALATION,
  TICKET_ESCALATION_RECIEVED,
  DELETE_TICKET,
  DELETE_TICKET_COMPLETE,
  DELETE_TICKET_STATUS_RESET,
  ACTION_HISTORY_SUMMARY,
  ACTION_HISTORY_SUMMARY_RECEIVED,
  ACTION_HISTORY_DETAILS,
  ACTION_HISTORY_DETAILS_RECEIVED,
  MEDIA_FILE_UPLOAD,
  MEDIA_FILE_UPLOAD_RESPONSE,
  MEDIA_FILE_UPLOAD_RESET,
} from './closedloop.actions';

describe('Closed Loop Actions', () => {
  it('should create an action to sync tickets', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const feedbackId = 'someFeedbackId';
    const expectedAction = {
      type: GET_TICKET_LIST_SYNC,
      token,
      param,
      feedbackId,
    };
    expect(actions.syncTickets(token, param, feedbackId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to clear ticket sync status', () => {
    const expectedAction = {
      type: CLEAR_TICKET_SYNC,
    };
    expect(actions.clearSyncTicketStatus()).toEqual(expectedAction);
  });

  it('should create an action to get default email template', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_DEFAULT_EMAIL_TEMPLATE,
      token,
      param,
    };
    expect(actions.getDefaultEmailTemplate(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get email templates', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_EMAIL_TEMPLATES,
      token,
      param,
    };
    expect(actions.getEmailTemplates(token, param)).toEqual(expectedAction);
  });

  it('should create an action to send email', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const param = {key: 'value'};
    const expectedAction = {
      type: SEND_EMAIL,
      token,
      ticketId,
      param,
    };
    expect(actions.sendEmail(token, ticketId, param)).toEqual(expectedAction);
  });

  it('should create an action to get latest comment', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: GET_LATEST_COMMENT,
      token,
      ticketId,
    };
    expect(actions.getLatestComment(token, ticketId)).toEqual(expectedAction);
  });

  it('should create an action to get ticket status history', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: GET_TICKET_STATUS_HISTORY,
      token,
      ticketId,
    };
    expect(actions.getTicketStatusHistory(token, ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get root cause list', () => {
    const token = 'someToken';
    const subscriberId = 'someSubscriberId';
    const expectedAction = {
      type: GET_ROOT_CASUES,
      token,
      subscriberId,
    };
    expect(actions.getRootCauseList(token, subscriberId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get action list', () => {
    const token = 'someToken';
    const subscriberId = 'someSubscriberId';
    const expectedAction = {
      type: GET_ACTIONS,
      token,
      subscriberId,
    };
    expect(actions.getActionList(token, subscriberId)).toEqual(expectedAction);
  });

  it('should create an action to update root cause', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const param = {key: 'value'};
    const feedbackApiKey = 'someFeedbackApiKey';
    const expectedAction = {
      type: UPDATE_ROOT_CAUSE,
      token,
      ticketId,
      param,
      feedbackApiKey,
    };
    expect(
      actions.updateRootCause(token, ticketId, param, feedbackApiKey),
    ).toEqual(expectedAction);
  });

  it('should create an action to set status filter by id', () => {
    const statusId = 'someStatusId';
    const expectedAction = {
      type: SET_TICKET_FILTER_BY_STATUS_ID,
      statusId,
    };
    expect(actions.setStatusFilterById(statusId)).toEqual(expectedAction);
  });

  it('should create an action to reset status filter id', () => {
    const expectedAction = {
      type: SET_TICKET_FILTER_BY_STATUS_ID,
      statusId: '',
    };
    expect(actions.resetStatusId()).toEqual(expectedAction);
  });

  it('should create an action to update ticket escalation', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const ticketId = 'someTicketId';
    const feedbackApiKey = 'someFeedbackApiKey';
    const expectedAction = {
      type: UPDATE_TICKET_ESCALATION,
      token,
      param,
      ticketId,
      feedbackApiKey,
    };
    expect(
      actions.updateSetTicketEscalation(token, param, ticketId, feedbackApiKey),
    ).toEqual(expectedAction);
  });

  it('should create an action to delete tickets', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: DELETE_TICKET,
      token,
      param,
    };
    expect(actions.deleteTickets(token, param)).toEqual(expectedAction);
  });

  it('should create an action to reset delete ticket status', () => {
    const expectedAction = {
      type: DELETE_TICKET_STATUS_RESET,
    };
    expect(actions.resetDeleteTicketStatus()).toEqual(expectedAction);
  });

  it('should create an action to get action history summary', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: ACTION_HISTORY_SUMMARY,
      token,
      ticketId,
    };
    expect(actions.getActionHistorySummary(token, ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get action history details', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: ACTION_HISTORY_DETAILS,
      token,
      ticketId,
    };
    expect(actions.getActionHistoryDetails(token, ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to upload a media file', () => {
    const param = {key: 'value'};
    const expectedAction = {
      type: MEDIA_FILE_UPLOAD,
      param,
    };
    expect(actions.postUploadFile(param)).toEqual(expectedAction);
  });

  it('should create an action to reset media file upload', () => {
    const param = {key: 'value'};
    const expectedAction = {
      type: MEDIA_FILE_UPLOAD_RESET,
      param,
    };
    expect(actions.resetUploadFilelist(param)).toEqual(expectedAction);
  });
});
