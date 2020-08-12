/* eslint-disable */
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {CX_GET_ALL_RESPONSE, CX_ADD_UPDATE_TICKET} from '../../api/Constant';
import {
  GET_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_UPDATED,
  UPDATE_FEEDBACK,
  API_ERROR,
  IS_LOADING,
} from '../actions/index';

export function* fetchFeedback(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
        CX_GET_ALL_RESPONSE,
        {'Auth-Token': action.token},
        action.param,
    );

    yield put({type: FEEDBACK_RECEIVED, response: json});
    yield put({type: IS_LOADING, payload: {isLoading: false}});

  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: API_ERROR, error: error});
  }
}

export function* watchGetFeedback() {
  yield takeLatest(GET_FEEDBACK, fetchFeedback);
}



export function* updateFetchFeedback(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
      CX_ADD_UPDATE_TICKET,
      {'Auth-Token': action.token},
      action.params,
    );

    yield put({type: FEEDBACK_UPDATED, response: json});

    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({type: API_ERROR, error: error});
  }
}

export function* watchUpdateFeedback() {
  yield takeLatest(UPDATE_FEEDBACK, updateFetchFeedback);
}
