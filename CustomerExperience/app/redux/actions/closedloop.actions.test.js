import * as actions from './closedloop.actions';
import {
  GET_TICKET_LIST_SYNC,
  CLEAR_TICKET_SYNC,
  GET_DEFAULT_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATES,
  SEND_EMAIL,
  RESET_SEND_EMAIL_RESPONSE,
  SEND_EMAIL_FAILED,
  RESET_SEND_EMAIL_ERROR,
  GET_LATEST_COMMENT,
  GET_TICKET_STATUS_HISTORY,
  SET_TICKET_FILTER_BY_STATUS_ID,
  GET_ROOT_CASUES,
  GET_ACTIONS,
  UPDATE_ROOT_CAUSE,
  UPDATE_CENTRALIZED_ROOT_CAUSE,
  CENTRALIZED_ROOT_CAUSE,
  ADD_DRAFT_CENTRALIZED_ROOT_CAUSE,
  REMOVE_DRAFT_CENTRALIZED_ROOT_CAUSE,
  RESET_DRAFT_CENTRALIZED_ROOT_CAUSE,
  UPDATE_TICKET_ESCALATION,
  DELETE_TICKET,
  DELETE_TICKET_STATUS_RESET,
  ACTION_HISTORY_SUMMARY,
  ACTION_HISTORY_DETAILS,
  MEDIA_FILE_UPLOAD,
  MEDIA_FILE_UPLOAD_RESET,
  GENERATE_EMAIL_DRAFT,
  GENERATE_REFINE_EMAIL_DRAFT,
  GET_TAGLIST,
  UPDATE_SINGLE_TAG,
  UPDATE_TAGS,
  CLEAR_TAG_FILTER,
  SAVE_TICKET_FILTER_DATA,
  CLEAR_TICKET_FILTER_DATA,
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

  it('should create an action to generate email draft', () => {
    const param = {key: 'value'};
    const expectedAction = {
      type: GENERATE_EMAIL_DRAFT,
      param,
    };
    expect(actions.generateEmailDraft(param)).toEqual(expectedAction);
  });
  it('should create an action to generate refine email draft', () => {
    const param = {key: 'value'};
    const expectedAction = {
      type: GENERATE_REFINE_EMAIL_DRAFT,
      param,
    };
    expect(actions.generateRefineEmailDraft(param)).toEqual(expectedAction);
  });

  it('should create resetSendEmailResponse action', () => {
    expect(actions.resetSendEmailResponse()).toEqual({type: RESET_SEND_EMAIL_RESPONSE});
  });

  it('should create sendEmailFailed action', () => {
    expect(actions.sendEmailFailed()).toEqual({type: SEND_EMAIL_FAILED});
  });

  it('should create resetSendEmailError action', () => {
    expect(actions.resetSendEmailError()).toEqual({type: RESET_SEND_EMAIL_ERROR});
  });

  it('should create getCentralizedRootCause action', () => {
    expect(actions.getCentralizedRootCause()).toEqual({type: CENTRALIZED_ROOT_CAUSE});
  });

  it('should create updateCentralizedRootCause action', () => {
    const result = actions.updateCentralizedRootCause('t1', {ids: [1]}, 'key123');
    expect(result.type).toBe(UPDATE_CENTRALIZED_ROOT_CAUSE);
    expect(result.ticketId).toBe('t1');
    expect(result.feedbackApiKey).toBe('key123');
  });

  it('should create resetCentralizedRootCause action', () => {
    expect(actions.resetCentralizedRootCause()).toEqual(
      expect.objectContaining({type: expect.any(String)}),
    );
  });

  it('should create addDraftTags action', () => {
    const result = actions.addDraftTags([1, 2], true, 'text');
    expect(result.type).toBe(ADD_DRAFT_CENTRALIZED_ROOT_CAUSE);
    expect(result.tagList).toEqual([1, 2]);
    expect(result.isOtherChecked).toBe(true);
    expect(result.otherText).toBe('text');
  });

  it('should create removeDraftTags action', () => {
    const result = actions.removeDraftTags([1], false, '');
    expect(result.type).toBe(REMOVE_DRAFT_CENTRALIZED_ROOT_CAUSE);
    expect(result.tagList).toEqual([1]);
  });

  it('should create resetDraftTags action', () => {
    expect(actions.resetDraftTags().type).toBe(RESET_DRAFT_CENTRALIZED_ROOT_CAUSE);
  });

  it('should create getTaglist action', () => {
    const result = actions.getTaglist({feedbackId: 'fid', param: {p: 1}});
    expect(result.type).toBe(GET_TAGLIST);
    expect(result.feedbackId).toBe('fid');
    expect(result.param).toEqual({p: 1});
  });

  it('should create updateSingleTag action', () => {
    const tag = {id: 1, isChecked: true};
    expect(actions.updateSingleTag(tag)).toEqual({type: UPDATE_SINGLE_TAG, tag});
  });

  it('should create updateTags action', () => {
    const tags = [{id: 1}, {id: 2}];
    expect(actions.updateTags(tags)).toEqual({type: UPDATE_TAGS, tags});
  });

  it('should create clearTagFilter action', () => {
    expect(actions.clearTagFilter()).toEqual({type: CLEAR_TAG_FILTER});
  });

  it('should create saveTicketFilterData action', () => {
    const filterData = {status: 'open'};
    expect(actions.saveTicketFilterData(filterData)).toEqual({
      type: SAVE_TICKET_FILTER_DATA,
      payload: filterData,
    });
  });

  it('should create clearTicketFilterData action', () => {
    expect(actions.clearTicketFilterData()).toEqual({type: CLEAR_TICKET_FILTER_DATA});
  });
});
