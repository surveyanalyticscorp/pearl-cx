import * as actions from './closedloop.actions';
import {
  GET_TICKET_LIST_SYNC,
  CLEAR_TICKET_SYNC,
  GET_DEFAULT_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATES,
  SEND_EMAIL,
  GET_LATEST_COMMENT,
  GET_TICKET_STATUS_HISTORY,
  SET_TICKET_FILTER_BY_STATUS_ID,
  GET_ROOT_CASUES,
  GET_ACTIONS,
  UPDATE_ROOT_CAUSE,
  UPDATE_TICKET_ESCALATION,
  DELETE_TICKET,
  DELETE_TICKET_STATUS_RESET,
  ACTION_HISTORY_SUMMARY,
  ACTION_HISTORY_DETAILS,
  MEDIA_FILE_UPLOAD,
  MEDIA_FILE_UPLOAD_RESET,
} from './closedloop.actions';

describe('Closed Loop Actions', () => {
  it('should create an action to sync tickets', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const feedbackID = 'someFeedbackId';
    const expectedAction = {
      type: GET_TICKET_LIST_SYNC,
      token,
      param,
      feedbackID,
    };
    expect(actions.syncTickets({token, param, feedbackID})).toEqual(
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
    const param = {key: 'value'};
    const ticketId = 'someTicketId';
    const feedbackApiKey = 'someFeedbackApiKey';
    const expectedAction = {
      type: UPDATE_TICKET_ESCALATION,

      param,
      ticketId,
      feedbackApiKey,
    };
    expect(
      actions.updateSetTicketEscalation(param, ticketId, feedbackApiKey),
    ).toEqual(expectedAction);
  });

  it('should create an action to delete tickets', () => {
    const param = {key: 'value'};
    const expectedAction = {
      type: DELETE_TICKET,

      param,
    };
    expect(actions.deleteTickets(param)).toEqual(expectedAction);
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
