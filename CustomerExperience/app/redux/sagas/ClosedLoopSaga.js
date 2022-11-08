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
} from '../../api/Constant';
import StringUtils from '../../Utils/StringUtils';

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
    const json = yield WebServiceHandler.get(
      CLF_GET_TICKET_DETAILS + action.ticketId,
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
