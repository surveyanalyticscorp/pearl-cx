// Imports: Dependencies
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {
  GET_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_UPDATED,
  UPDATE_FEEDBACK, API_ERROR,
} from '../actions';

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* fetchFeedbackAsync(action) {
  try {
    console.log('DD fetchFeedbackAsync:' + action.param.year);
    const json = yield WebServiceHandler.post(
      BASE_URL + 'a/nativehtml/cx.CXGetAllResponses',
      {'Auth-Token': action.token},
      action.param,
    );

    // Dispatch Action To Redux Store
    yield put({
      type: FEEDBACK_RECEIVED,
      response: json,
    });
  } catch (error) {
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

// Watcher: Increase Counter Async
export function* watchGetFeedback() {
  yield takeLatest(GET_FEEDBACK, fetchFeedbackAsync);
}

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* updateFetchFeedbackAsync(action) {
  try {
    console.log('DD fetchFeedbackAsync:' + action.param);
    const json = yield WebServiceHandler.post(
      BASE_URL + 'a/nativehtml/cx.CXAddOrUpdateTicket',
      {'Auth-Token': action.token},
      action.params,
    );

    // Dispatch Action To Redux Store
    yield put({
      type: FEEDBACK_UPDATED,
      response: json,
    });
  } catch (error) {
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

// Watcher: Increase Counter Async
export function* watchUpdateFeedback() {
  yield takeLatest(UPDATE_FEEDBACK, updateFetchFeedbackAsync);
}
