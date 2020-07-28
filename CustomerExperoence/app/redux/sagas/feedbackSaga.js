import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {BASE_URL} from '../../api/types';
import {
  GET_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_UPDATED,
  UPDATE_FEEDBACK,
  API_ERROR,
  IS_LOADING,
} from '../actions/index';

function* fetchFeedbackAsync(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
      BASE_URL + 'a/nativehtml/cx.CXGetAllResponses',
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: FEEDBACK_RECEIVED,
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

export function* watchGetFeedback() {
  yield takeLatest(GET_FEEDBACK, fetchFeedbackAsync);
}

function* updateFetchFeedbackAsync(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
      BASE_URL + 'a/nativehtml/cx.CXAddOrUpdateTicket',
      {'Auth-Token': action.token},
      action.params,
    );

    yield put({
      type: FEEDBACK_UPDATED,
      response: json,
    });
    yield put({
      type: IS_LOADING,
      payload: {isLoading: false},
    });
  } catch (error) {
    yield put({
      type: IS_LOADING,
      payload: {isLoading: false},
    });
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchUpdateFeedback() {
  yield takeLatest(UPDATE_FEEDBACK, updateFetchFeedbackAsync);
}
