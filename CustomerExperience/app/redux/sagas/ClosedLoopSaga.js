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
  SET_TOKEN_EXPIRED,
} from '../actions/dashboard.actions';
import {
  CX_ADD_CLOSED_LOOP_TICKET,
  CX_GET_CLOSED_LOOP_OWNER_DETAILS,
  CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
  CX_GET_CLOSED_LOOP_TICKET_DETAILS,
  CX_UPDATE_CLOSED_LOOP_TICKET,
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
  CLF_GET_CENTRALIZED_ROOT_CAUSE,
  getGenerateEmailDraftEndPoint,
  POST_GENERATE_REFINED_EMAIL_DRAFT,
  CLF_UPDATE_CENTRALIZED_ROOT_CAUSE_POSTFIX,
  CLF_UPDATE_CENTRALIZED_ROOT_CAUSE_PREFIX,
} from '../../api/Constant';
import StringUtils from '../../Utils/StringUtils';
import {
  ACTIONS_RECEIVED,
  ACTION_HISTORY_DETAILS,
  ACTION_HISTORY_DETAILS_RECEIVED,
  ACTION_HISTORY_SUMMARY,
  ACTION_HISTORY_SUMMARY_RECEIVED,
  CENTRALIZED_ROOT_CAUSE,
  CENTRALIZED_ROOT_CAUSE_RECEIVED,
  CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED,
  DELETE_TICKET,
  DELETE_TICKET_COMPLETE,
  GENERATE_EMAIL_DRAFT,
  GENERATE_EMAIL_DRAFT_RECEIVED,
  GENERATE_REFINE_EMAIL_DRAFT,
  GENERATE_REFINE_EMAIL_DRAFT_RECEIVED,
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
  UPDATE_CENTRALIZED_ROOT_CAUSE,
  UPDATE_ROOT_CAUSE,
  UPDATE_TICKET_ESCALATION,
} from '../actions/closedloop.actions';
import {
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';
import {getBearerTokenStatic, getClfUrl} from '../../Utils/ApiCallUtils';

export function* fetchDetractorTicketDetails(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
      CX_GET_CLOSED_LOOP_TICKET_DETAILS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
      response: json,
    });
    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetDetractorTicketDetail() {
  yield takeLatest(GET_CLOSED_LOOP_TICKET_DETAILS, fetchDetractorTicketDetails);
}

export function* fetchFirstTimeClosedLoopSegmentDetails(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
      response: json,
    });

    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetFirstTimeClosedLoopSegmentDetails() {
  yield takeLatest(
    GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
    fetchFirstTimeClosedLoopSegmentDetails,
  );
}

export function* fetchClosedLoopSegmentDetails(action) {
  try {
    // yield put({type: IS_LOADING, payload: {isLoading: true}});

    const json = yield WebServiceHandler.postNew(
      CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
      response: json,
    });
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetClosedLoopSegmentDetails() {
  yield takeLatest(
    GET_CLOSED_LOOP_SEGMENT_DETAILS,
    fetchClosedLoopSegmentDetails,
  );
}

export function* fetchClosedLoopOwnerDetails(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_GET_CLOSED_LOOP_OWNER_DETAILS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
      response: json,
    });
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetClosedLoopOwnerDetails() {
  yield takeLatest(GET_CLOSED_LOOP_OWNER_DETAILS, fetchClosedLoopOwnerDetails);
}

export function* fetchClosedLoopAllOwners(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_GET_CLOSED_LOOP_SEGMENT_AND_OWNER_BY_FEEDBACK,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED,
      response: json,
    });
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetClosedLoopAllOwners() {
  yield takeLatest(
    GET_CLOSED_LOOP_ALL_OWNERS_DETAILS,
    fetchClosedLoopAllOwners,
  );
}

export function updateClosedLoopTicket(
  token,
  body,
  successCallback,
  errorCallback,
) {
  return WebServiceHandler.postNew(
    CX_UPDATE_CLOSED_LOOP_TICKET,
    {'Auth-Token': token},
    body,
  )
    .then(response => {
      if (StringUtils.isNotEmpty(response.body.Error)) {
        errorCallback(response.body.Error);
      } else {
        successCallback(response.body);
      }
    })
    .catch(error => {
      errorCallback(error.errorAlert);
    });
}

export function addClosedLoopTicket(
  token,
  body,
  successCallback,
  errorCallback,
) {
  return WebServiceHandler.postNew(
    CX_ADD_CLOSED_LOOP_TICKET,
    {'Auth-Token': token},
    body,
  )
    .then(response => {
      if (StringUtils.isNotEmpty(response.body.Error)) {
        errorCallback(response.body.Error);
      } else {
        successCallback(response.body);
      }
    })
    .catch(error => {
      console.log(error);
      errorCallback(error.errorAlert);
    });
}

export function* syncTickets(action) {
  try {
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    let hasNextCall = true;
    let response = {};
    while (hasNextCall) {
      response = yield WebServiceHandler.get(
        getClfUrl(syncTicketList(action.feedbackID)),
        getBearerTokenStatic(),
        action.param,
      );
      hasNextCall = response?.hasNextCall ?? false;
      console.log('GET_TICKET_LIST_SYNC_RECEIVED: ', JSON.stringify(response));
      if (!hasNextCall) {
        break;
      }
    }
    console.log(
      'GET_TICKET_LIST_SYNC_RECEIVED: ',
      'Break',
      JSON.stringify(response),
    );
    yield put({
      type: GET_TICKET_LIST_SYNC_RECEIVED,
      response: response,
    });
  } catch (error) {
    if (JSON.stringify(error).includes('jwt expired')) {
      yield put({type: SET_TOKEN_EXPIRED, isTokenExpired: true});
    } else if (JSON.stringify(error).includes('ticketsHttpException')) {
      console.log('TICKET_SYNC_ERROR', JSON.stringify(error));
    } else {
      console.log('TICKET_SYNC_OTHER_ERROR', JSON.stringify(error));
    }
  }
}
export function* watchSyncTickets() {
  yield takeLatest(GET_TICKET_LIST_SYNC, syncTickets);
}
export function* fetchClosedLoopTicketList(action) {
  try {
    // yield put({type: IS_LOADING, payload: {isLoading: true}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const json = yield WebServiceHandler.get(
      getClfUrl(getClfTicketListUrl(action.feedbackId, action.segmentId)),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_LIST_RECEIVED,
      response: json,
    });
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetClosedLoopTicketList() {
  yield takeLatest(GET_CLOSED_LOOP_TICKET_LIST, fetchClosedLoopTicketList);
}

export function* fetchClosedLoopTicketItem(action) {
  try {
    // yield put({type: IS_LOADING, payload: {isLoading: true}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketItem = yield WebServiceHandler.get(
      getClfUrl(
        CLF_GET_TICKET_DETAILS +
          action.ticketId +
          FEEDBACK_API_KEY_ENDPOINT +
          action.feedbackApiKey,
      ),
      getBearerTokenStatic(),
      action.param,
    );

    const comments = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS),
      getBearerTokenStatic(),
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
      ticketData: ticketItem.data,
      ticketComments: comments.data,
      ticketActivity: ticketActivity.data,
    });
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});

    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetClosedLoopTicketItem() {
  yield takeLatest(GET_CLOSED_LOOP_TICKET_ITEM, fetchClosedLoopTicketItem);
}

export function* fetchClosedLoopTicketComments(action) {
  try {
    const comments = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      ticketComments: comments.data,
    });
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetClosedLoopTicketComments() {
  yield takeLatest(
    GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
    fetchClosedLoopTicketComments,
  );
}

export function* fetchClosedLoopTicketActivity(action) {
  try {
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketActivity = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
      ticketActivity: ticketActivity.data,
    });
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});

    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});

    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetClosedLoopTicketActivity() {
  yield takeLatest(
    GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,
    fetchClosedLoopTicketActivity,
  );
}

export function* postTicketComment(action) {
  try {
    console.log('TICKET_COMENTS', JSON.stringify(action));
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const json = yield WebServiceHandler.postNew(
      getClfUrl(CLF_GET_TICKET_DETAILS + COMMNETS),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      response: json,
    });

    const comments = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS),
      getBearerTokenStatic(),
      action.param,
    );

    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      ticketComments: comments.data,
    });

    const ticketItem = yield WebServiceHandler.get(
      getClfUrl(
        CLF_GET_TICKET_DETAILS +
          action.ticketId +
          FEEDBACK_API_KEY_ENDPOINT +
          action.feedbackApiKey,
      ),
      getBearerTokenStatic(),
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: UPDATE_CLF_TICKET_RECIEVED,
      ticketData: ticketItem.data,
      ticketComments: comments.data,
      ticketActivity: ticketActivity.data,
    });

    // yield put({
    //   type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
    //   response: json,
    // });

    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});

    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchPostTicketComment() {
  yield takeLatest(ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS, postTicketComment);
}

export function* postCreateClfTicket(action) {
  try {
    const URL = getClfUrl(
      CLF_GET_TICKET_DETAILS +
        FEEDBACK_API_KEY_ENDPOINT +
        action.feedbackApiKey,
    );
    const json = yield WebServiceHandler.postNew(
      URL,
      getBearerTokenStatic(),
      action.param,
    );

    // const json_ = yield WebServiceHandler.get(
    //   CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
    //   {'Auth-Token': action.token},
    //   action.param,
    // );

    yield put({
      type: CREATE_CLF_TICKET_RECIEVED,
      response: json,
    });

    // yield put({
    //   type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
    //   response: json_,
    // });
    yield put({
      type: WANT_TO_RELOAD_DASHBOARD,
      payload: {wantToReload: true},
    });
    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchPostCreateTicket() {
  yield takeLatest(CREATE_CLF_TICKET, postCreateClfTicket);
}

export function* patchUpdateClfTicket(action) {
  try {
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketItem = yield WebServiceHandler.patch(
      getClfUrl(
        CLF_GET_TICKET_DETAILS +
          action.ticketId +
          FEEDBACK_API_KEY_ENDPOINT +
          action.feedbackApiKey,
      ),
      getBearerTokenStatic(),
      action.param,
    );
    const comments = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS),
      getBearerTokenStatic(),
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: UPDATE_CLF_TICKET_RECIEVED,
      ticketData: ticketItem.data,
      ticketComments: comments.data,
      ticketActivity: ticketActivity.data,
    });

    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
    showSuccessFlashMessage(ticketItem.message);
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});

    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchPatchUpdateTicket() {
  yield takeLatest(UPDATE_CLF_TICKET, patchUpdateClfTicket);
}

export function* patchTicketEscalation(action) {
  try {
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketItem = yield WebServiceHandler.patch(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + ESCALATE),
      getBearerTokenStatic(),
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG),
      getBearerTokenStatic(),
      action.param,
    );

    yield put({
      type: TICKET_ESCALATION_RECIEVED,
      ticketData: ticketItem.data,
      // ticketComments: comments.data,
      ticketActivity: ticketActivity.data,
    });

    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
    showSuccessFlashMessage(ticketItem.message);
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});

    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchTicketEscalation() {
  yield takeLatest(UPDATE_TICKET_ESCALATION, patchTicketEscalation);
}

export function* getEmailTemplates(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_EMAIL_TEMPLATES),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: GET_EMAIL_TEMPLATES_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetEmailTemplates() {
  yield takeLatest(GET_EMAIL_TEMPLATES, getEmailTemplates);
}

export function* getDefaultEmailTemplate(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_DEFAULT_EMAIL_TEMPLATE),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetDefaultEmailTemplate() {
  yield takeLatest(GET_DEFAULT_EMAIL_TEMPLATE, getDefaultEmailTemplate);
}

export function* sendEmail(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      getClfUrl(
        CLF_SEND_EMAIL_PREFIX + action.ticketId + CLF_SEND_EMAIL_POSTFIX,
      ),
      getBearerTokenStatic(),
      action.param,
      {},
    );
    yield put({
      type: SEND_EMAIL_RECEIVED,
      response: json,
    });
    yield put({
      type: MEDIA_FILE_UPLOAD_RESET,
      response: [],
    });
    showSuccessFlashMessage(json.message);
  } catch (error) {
    showErrorFlashMessage(error.message);
    console.log('ERROR:', JSON.stringify(error));
    // yield put({
    //   type: API_ERROR,
    //   error: error,
    // });
  }
}
export function* watchSendEmail() {
  yield takeLatest(SEND_EMAIL, sendEmail);
}

export function* getLatestComment(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(
        CLF_LATEST_COMMENT_BY_TICKET_ID_PREFIX +
          action.ticketId +
          CLF_LATEST_COMMENT_BY_TICKET_ID_POSTFIX,
      ),
      getBearerTokenStatic(),
      {},
    );
    yield put({
      type: LATEST_COMMENT_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetLatestComment() {
  yield takeLatest(GET_LATEST_COMMENT, getLatestComment);
}

export function* getTicketStatusHistory(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(
        CLF_STATUS_HISTORY_BY_PREFIX +
          action.ticketId +
          CLF_STATUS_HISTORY_BY_POSTFIX,
      ),
      getBearerTokenStatic(),
      {},
    );
    yield put({
      type: GET_TICKET_STATUS_HISTORY_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetTicketStatusHistory() {
  yield takeLatest(GET_TICKET_STATUS_HISTORY, getTicketStatusHistory);
}

export function* getRootCauseList(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_ROOT_CAUSE),
      getBearerTokenStatic(),
      {},
    );
    yield put({
      type: ROOT_CASUES_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetrootCauseList() {
  yield takeLatest(GET_ROOT_CASUES, getRootCauseList);
}

export function* getRootCauseActionList(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_ROOT_CAUSE_ACTIONS),
      getBearerTokenStatic(),

      {},
    );
    yield put({
      type: ACTIONS_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetrootCauseActionList() {
  yield takeLatest(GET_ACTIONS, getRootCauseActionList);
}

export function* getCentralizedRootCause() {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(CLF_GET_CENTRALIZED_ROOT_CAUSE),
      getBearerTokenStatic(),
    );
    yield put({
      type: CENTRALIZED_ROOT_CAUSE_RECEIVED,
      response: json.data,
    });
  } catch (error) {
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetCentralizdRootCause() {
  yield takeLatest(CENTRALIZED_ROOT_CAUSE, getCentralizedRootCause);
}
export function* updateRootCauseAndAction(action) {
  try {
    const json = yield WebServiceHandler.patch(
      getClfUrl(
        CLF_UPDATE_ROOT_CAUSE_PREFIX +
          action.ticketId +
          CLF_UPDATE_ROOT_CAUSE_POSTFIX,
      ),
      getBearerTokenStatic(),
      action.param,
    );

    const ticketItem = yield WebServiceHandler.get(
      getClfUrl(
        CLF_GET_TICKET_DETAILS +
          action.ticketId +
          FEEDBACK_API_KEY_ENDPOINT +
          action.feedbackApiKey,
      ),
      getBearerTokenStatic(),
      action.param,
    );

    yield put({
      type: ROOT_CAUSE_UPDATE_RECEIVED,
      response: json.data,
      ticketData: ticketItem.data,
    });

    fetchClosedLoopTicketItem(action);

    showSuccessFlashMessage(json.message ?? 'Updated');
  } catch (error) {
    showErrorFlashMessage(
      error.message ?? error.status ?? JSON.stringify(error),
    );
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchUpdateRootCause() {
  yield takeLatest(UPDATE_ROOT_CAUSE, updateRootCauseAndAction);
}

export function* updateCentralizedRootCause(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      getClfUrl(
        CLF_UPDATE_CENTRALIZED_ROOT_CAUSE_PREFIX +
          action.ticketId +
          CLF_UPDATE_CENTRALIZED_ROOT_CAUSE_POSTFIX,
      ),
      getBearerTokenStatic(),
      action.param,
    );
    JSON.stringify(
      'action',
      JSON.stringify(action),
      'json',
      JSON.stringify(json),
    );
    if (json.status === 'success') {
      yield put({
        type: CENTRALIZED_ROOT_CAUSE_UPDATE_RECEIVED,
        response: json,
      });
      fetchClosedLoopTicketItem(action);
      showSuccessFlashMessage(json.message ?? 'Updated');
    }
  } catch (error) {
    showErrorFlashMessage(
      error.message ?? error.status ?? JSON.stringify(error),
    );
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchUpdateCentralizedRootCause() {
  yield takeLatest(UPDATE_CENTRALIZED_ROOT_CAUSE, updateCentralizedRootCause);
}

export function* deleteTickets(action) {
  try {
    const json = yield WebServiceHandler.delete(
      getClfUrl(CLF_DELETE_TICKETS),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: DELETE_TICKET_COMPLETE,
      response: json,
    });
    showSuccessFlashMessage(json.message ?? 'TICKETS DELETED');
  } catch (error) {
    showErrorFlashMessage(
      error.message ?? error.status ?? JSON.stringify(error),
    );
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchDeleteTickets() {
  yield takeLatest(DELETE_TICKET, deleteTickets);
}

export function* fetchActionSummary(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(
        CLF_GET_ACTION_HISTORY_PREFIX +
          action.ticketId +
          CLF_GET_ACTION_SUMMARY_POSTFIX,
      ),
      getBearerTokenStatic(),
      {},
    );
    yield put({
      type: ACTION_HISTORY_SUMMARY_RECEIVED,
      response: json,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchActionSummary() {
  yield takeLatest(ACTION_HISTORY_SUMMARY, fetchActionSummary);
}

export function* fetchActionDetails(action) {
  try {
    const json = yield WebServiceHandler.get(
      getClfUrl(
        CLF_GET_ACTION_HISTORY_PREFIX +
          action.ticketId +
          CLF_GET_ACTION_DETAILS_POSTFIX,
      ),
      getBearerTokenStatic(),
      {},
    );
    yield put({
      type: ACTION_HISTORY_DETAILS_RECEIVED,
      response: json,
    });
  } catch (error) {
    // console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchActionDetails() {
  yield takeLatest(ACTION_HISTORY_DETAILS, fetchActionDetails);
}

export function* uploadMediaFile(action) {
  try {
    const json = yield WebServiceHandler.postUploadFile(
      getClfUrl(CLF_MEDIA_UPLOAD),
      getBearerTokenStatic(),
      action.param,
    );
    yield put({
      type: MEDIA_FILE_UPLOAD_RESPONSE,
      response: json,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
  }
}
export function* watchUploadFile() {
  yield takeLatest(MEDIA_FILE_UPLOAD, uploadMediaFile);
}

export function* generateEmailDraft(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      getClfUrl(
        getGenerateEmailDraftEndPoint(action.ticketId, action.feedbackId),
      ),
      getBearerTokenStatic(),
      action.param,
    );
    if (json.status === 'success') {
      yield put({
        type: GENERATE_EMAIL_DRAFT_RECEIVED,
        response: json.data,
      });
    }
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
  }
}
export function* watchGenrateEmailDraft() {
  yield takeLatest(GENERATE_EMAIL_DRAFT, generateEmailDraft);
}

export function* generateRefinedEmailDraft(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      getClfUrl(POST_GENERATE_REFINED_EMAIL_DRAFT),
      getBearerTokenStatic(),
      action.param,
    );
    if (json.status === 'success') {
      yield put({
        type: GENERATE_REFINE_EMAIL_DRAFT_RECEIVED,
        response: json.data,
      });
    }
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
  }
}

export function* watchGenerateRefinedEmailDraft() {
  yield takeLatest(GENERATE_REFINE_EMAIL_DRAFT, generateRefinedEmailDraft);
}
