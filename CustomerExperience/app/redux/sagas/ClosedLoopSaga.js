import {API_ERROR, IS_LOADING} from '../actions';
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
  CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
  CLOSED_LOOP_TICKET_LIST_RECEIVED,
  GET_CLOSED_LOOP_OWNER_DETAILS,
  GET_CLOSED_LOOP_SEGMENT_DETAILS,
  GET_CLOSED_LOOP_TICKET_DETAILS,
  GET_CLOSED_LOOP_TICKET_LIST,
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
      CLF_GET_TICKET_LIST + '25951' + '/' + SEGMENT + '188911',
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: CLOSED_LOOP_TICKET_LIST_RECEIVED,
      response: json,
    });
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
