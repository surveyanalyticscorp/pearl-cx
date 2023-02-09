import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  CLF_GET_TICKET_LIST_BY_RESPONSEID,
  CX_GET_PANEL_MEMBER,
  CX_RESPONSE_DETAILS_BY_RESPONSEID,
  CX_RESPONSE_SURVEY_DETAILS,
  RESPONSES,
} from '../../api/Constant';
import {API_ERROR} from '../actions/index';
import {
  GET_PANEL_MEMBER,
  GET_RESPONSE_DETAILS_BY_RESPONSEID,
  GET_RESPONSE_TICKETS,
  GET_RESPONSE_TICKETS_RECEIVED,
  GET_SURVEY_RESPONSE_DETAILS,
  PANEL_MEMBER_RECEIVED,
  RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED,
  SURVEY_RESPONSE_DETAILS_RECEIVED,
} from '../actions/feedback.actions';
// import {FEEDBACK_RECEIVED, FEEDBACK_UPDATED, GET_FEEDBACK, UPDATE_FEEDBACK} from '../actions/feedback.actions';

export function* fetchPanelMemberData(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_GET_PANEL_MEMBER,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({type: PANEL_MEMBER_RECEIVED, response: json});
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: API_ERROR, error: error});
  }
}

export function* watchGetPanelMember() {
  yield takeLatest(GET_PANEL_MEMBER, fetchPanelMemberData);
}

export function* fetchSurveyResponseDetails(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_RESPONSE_SURVEY_DETAILS,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({type: SURVEY_RESPONSE_DETAILS_RECEIVED, response: json});
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: API_ERROR, error: error});
  }
}

export function* watchGetSurveyResponseDetails() {
  yield takeLatest(GET_SURVEY_RESPONSE_DETAILS, fetchSurveyResponseDetails);
}

export function* fetchResponseTickets(action) {
  try {
    const json = yield WebServiceHandler.get(
      CLF_GET_TICKET_LIST_BY_RESPONSEID +
        action.feedbackId +
        '/' +
        RESPONSES +
        action.responseId,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({type: GET_RESPONSE_TICKETS_RECEIVED, response: json});
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: API_ERROR, error: error});
  }
}

export function* watchGetResponseTickets() {
  yield takeLatest(GET_RESPONSE_TICKETS, fetchResponseTickets);
}

export function* fetchResponseByResponseId(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_RESPONSE_DETAILS_BY_RESPONSEID,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({type: RESPONSE_DETAILS_BY_RESPONSEID_RECEIVED, data: json});
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    // yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: API_ERROR, error: error});
  }
}

export function* watchGetResponseDetailsByResponseId() {
  yield takeLatest(GET_RESPONSE_DETAILS_BY_RESPONSEID, fetchResponseTickets);
}

// export function* updateFetchFeedback(action) {
//   try {
//     yield put({type: IS_LOADING, payload: {isLoading: true}});
//     const json = yield WebServiceHandler.postNew(
//       CX_ADD_UPDATE_TICKET,
//       {'Auth-Token': action.token},
//       action.params,
//     );
//
//     yield put({type: FEEDBACK_UPDATED, response: json});
//
//     yield put({type: IS_LOADING, payload: {isLoading: false}});
//   } catch (error) {
//     yield put({type: IS_LOADING, payload: {isLoading: false}});
//     yield put({type: API_ERROR, error: error});
//   }
// }
//
// export function* watchUpdateFeedback() {
//   yield takeLatest(UPDATE_FEEDBACK, updateFetchFeedback);
// }
