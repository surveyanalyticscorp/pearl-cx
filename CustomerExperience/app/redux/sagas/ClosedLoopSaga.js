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
  CX_ADD_CLOSED_LOOP_TICKET,
  CX_GET_CLOSED_LOOP_OWNER_DETAILS,
  CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
  CX_GET_CLOSED_LOOP_TICKET_DETAILS,
  CX_UPDATE_CLOSED_LOOP_TICKET,
  CLF_GET_TICKET_LIST,
  SEGMENT,
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
  CLF_GET_ROOT_CAUSE_PREFIX,
  CLF_GET_ROOT_CAUSE_POSTFIX,
  CLF_GET_ROOT_CAUSE_ACTIONS_PREFIX,
  CLF_GET_ROOT_CAUSE_ACTIONS_POSTFIX,
  CLF_UPDATE_ROOT_CAUSE_PREFIX,
  CLF_UPDATE_ROOT_CAUSE_POSTFIX,
  CLF_BASE_URL,
  CLF_QA_BASE_URL,
  CLF_GET_TICKET_lIST_SYNC,
  ESCALATE,
} from '../../api/Constant';
import StringUtils from '../../Utils/StringUtils';
import {
  ACTIONS_RECEIVED,
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

function* fetchDetractorTicketDetails(action) {
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

function* fetchFirstTimeClosedLoopSegmentDetails(action) {
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

function* fetchClosedLoopSegmentDetails(action) {
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

function* fetchClosedLoopOwnerDetails(action) {
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

function* fetchClosedLoopAllOwners(action) {
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
    .then((response) => {
      if (StringUtils.isNotEmpty(response.body.Error)) {
        errorCallback(response.body.Error);
      } else {
        successCallback(response.body);
      }
    })
    .catch((error) => {
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
    .then((response) => {
      if (StringUtils.isNotEmpty(response.body.Error)) {
        errorCallback(response.body.Error);
      } else {
        successCallback(response.body);
      }
    })
    .catch((error) => {
      console.log(error);
      errorCallback(error.errorAlert);
    });
}

function* syncTickets(action) {
  try {
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const response = yield WebServiceHandler.get(
      CLF_GET_TICKET_lIST_SYNC(action.feedbackId),
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: GET_TICKET_LIST_SYNC_RECEIVED,
      response: response,
    });
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchSyncTickets() {
  yield takeLatest(GET_TICKET_LIST_SYNC, syncTickets);
}
function* fetchClosedLoopTicketList(action) {
  try {
    // yield put({type: IS_LOADING, payload: {isLoading: true}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const json = yield WebServiceHandler.get(
      CLF_GET_TICKET_LIST +
        action.feedbackId +
        '/' +
        SEGMENT +
        action.segmentId,
      {'Auth-Token': action.token},
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

function* fetchClosedLoopTicketItem(action) {
  try {
    // yield put({type: IS_LOADING, payload: {isLoading: true}});
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketItem = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS +
        action.ticketId +
        FEEDBACK_API_KEY_ENDPOINT +
        action.feedbackApiKey,
      {'Auth-Token': action.token},
      action.param,
    );

    const comments = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
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

function* fetchClosedLoopTicketComments(action) {
  try {
    const comments = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS,
      {'Auth-Token': action.token},
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

function* fetchClosedLoopTicketActivity(action) {
  try {
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketActivity = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
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

function* postTicketComment(action) {
  try {
    console.log('TICKET_COMENTS', JSON.stringify(action));
    // yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const json = yield WebServiceHandler.postNew(
      CLF_GET_TICKET_DETAILS + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      response: json,
    });

    const comments = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      ticketComments: comments.data,
    });

    const ticketItem = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS +
        action.ticketId +
        FEEDBACK_API_KEY_ENDPOINT +
        action.feedbackApiKey,
      {'Auth-Token': action.token},
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
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

function* postCreateClfTicket(action) {
  try {
    const URL =
      CLF_GET_TICKET_DETAILS +
      FEEDBACK_API_KEY_ENDPOINT +
      action.feedbackApiKey;
    const json = yield WebServiceHandler.postNew(
      URL,
      {'Auth-Token': action.token},
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

function* patchUpdateClfTicket(action) {
  try {
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketItem = yield WebServiceHandler.patch(
      CLF_GET_TICKET_DETAILS +
        action.ticketId +
        FEEDBACK_API_KEY_ENDPOINT +
        action.feedbackApiKey,
      {'Auth-Token': action.token},
      action.param,
    );
    const comments = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
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

function* patchTicketEscalation(action) {
  try {
    yield put({type: IS_TICKET_LOADING, payload: {isLoading: true}});

    const ticketItem = yield WebServiceHandler.patch(
      CLF_GET_TICKET_DETAILS + action.ticketId + ESCALATE,
      {'Auth-Token': action.token},
      action.param,
    );

    const ticketActivity = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
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

function* getEmailTemplates(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_EMAIL_TEMPLATES,
      {'Auth-Token': action.token},
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

function* getDefaultEmailTemplate(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_DEFAULT_EMAIL_TEMPLATE,
      {'Auth-Token': action.token},
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

function* sendEmail(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CLF_SEND_EMAIL_PREFIX + action.ticketId + CLF_SEND_EMAIL_POSTFIX,
      {'Auth-Token': action.token},
      action.param,
      action.queryParam,
    );
    yield put({
      type: SEND_EMAIL_RECEIVED,
      response: json,
    });
    showSuccessFlashMessage(json.message);
  } catch (error) {
    showErrorFlashMessage(error.message);
    console.log('ERROR:', JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchSendEmail() {
  yield takeLatest(SEND_EMAIL, sendEmail);
}

function* getLatestComment(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_LATEST_COMMENT_BY_TICKET_ID_PREFIX +
        action.ticketId +
        CLF_LATEST_COMMENT_BY_TICKET_ID_POSTFIX,
      {'Auth-Token': action.token},
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

function* getTicketStatusHistory(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_STATUS_HISTORY_BY_PREFIX +
        action.ticketId +
        CLF_STATUS_HISTORY_BY_POSTFIX,
      {'Auth-Token': action.token},
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

function* getRootCauseList(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_ROOT_CAUSE_PREFIX +
        action.subscriberId +
        CLF_GET_ROOT_CAUSE_POSTFIX,
      {'Auth-Token': action.token},
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

function* getRootCauseActionList(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_ROOT_CAUSE_ACTIONS_PREFIX +
        action.subscriberId +
        CLF_GET_ROOT_CAUSE_ACTIONS_POSTFIX,
      {'Auth-Token': action.token},
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

function* updateRootCauseAndAction(action) {
  try {
    const json = yield WebServiceHandler.patch(
      CLF_UPDATE_ROOT_CAUSE_PREFIX +
        action.ticketId +
        CLF_UPDATE_ROOT_CAUSE_POSTFIX,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: ROOT_CAUSE_UPDATE_RECEIVED,
      response: json.data,
    });
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
