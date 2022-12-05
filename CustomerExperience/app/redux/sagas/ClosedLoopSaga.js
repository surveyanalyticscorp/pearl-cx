import {API_ERROR, IS_LOADING} from '../actions';
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
} from '../actions/dashboard.actions';
import {
  CX_ADD_CLOSED_LOOP_TICKET,
  CX_GET_CLOSED_LOOP_OWNER_DETAILS,
  CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
  CX_GET_CLOSED_LOOP_TICKET_DETAILS,
  CX_UPDATE_CLOSED_LOOP_TICKET,
  CLF_GET_TICKET_LIST,
  FEEDBACK,
  SEGMENT,
  CLF_GET_TICKET_DETAILS,
  COMMNETS,
  ACTIVITY_LOG,
  FEEDBACK_API_KEY,
  FEEDBACK_API_KEY_ENDPOINT,
  CLF_GET_EMAIL_TEMPLATES,
  CLF_GET_DEFAULT_EMAIL_TEMPLATE,
  CLF_SEND_EMAIL_PREFIX,
  CLF_SEND_EMAIL_POSTFIX,
} from '../../api/Constant';
import StringUtils from '../../Utils/StringUtils';
import {
  GET_DEFAULT_EMAIL_TEMPLATE,
  GET_DEFAULT_EMAIL_TEMPLATE_RECEIVED,
  GET_EMAIL_TEMPLATES,
  GET_EMAIL_TEMPLATES_RECEIVED,
  SEND_EMAIL,
  SEND_EMAIL_RECEIVED,
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

function* fetchClosedLoopSegmentDetails(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
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
    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetClosedLoopOwnerDetails() {
  yield takeLatest(GET_CLOSED_LOOP_OWNER_DETAILS, fetchClosedLoopOwnerDetails);
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

function* fetchClosedLoopTicketList(action) {
  try {
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
export function* watchGetClosedLoopTicketList() {
  yield takeLatest(GET_CLOSED_LOOP_TICKET_LIST, fetchClosedLoopTicketList);
}

function* fetchClosedLoopTicketItem(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});

    const json = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS +
        action.ticketId +
        FEEDBACK_API_KEY_ENDPOINT +
        action.feedbackApiKey,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_RECEIVED,
      response: json,
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
export function* watchGetClosedLoopTicketItem() {
  yield takeLatest(GET_CLOSED_LOOP_TICKET_ITEM, fetchClosedLoopTicketItem);
}

function* fetchClosedLoopTicketComments(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      response: json,
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
export function* watchGetClosedLoopTicketComments() {
  yield takeLatest(
    GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
    fetchClosedLoopTicketComments,
  );
}

function* fetchClosedLoopTicketActivity(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
      response: json,
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
export function* watchGetClosedLoopTicketActivity() {
  yield takeLatest(
    GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,
    fetchClosedLoopTicketActivity,
  );
}

function* postTicketComment(action) {
  try {
    console.log('TICKET_COMENTS', JSON.stringify(action));

    const json = yield WebServiceHandler.postNew(
      CLF_GET_TICKET_DETAILS + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      response: json,
    });

    const json_ = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + COMMNETS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
      response: json_,
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

    const json_ = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId + '/' + ACTIVITY_LOG,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: CREATE_CLF_TICKET_RECIEVED,
      response: json,
    });

    yield put({
      type: CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
      response: json_,
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
    const json = yield WebServiceHandler.patch(
      CLF_GET_TICKET_DETAILS + action.ticketId,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: UPDATE_CLF_TICKET_RECIEVED,
      response: json,
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
export function* watchPatchUpdateTicket() {
  yield takeLatest(UPDATE_CLF_TICKET, patchUpdateClfTicket);
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
