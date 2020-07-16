// Imports: Dependencies
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {GET_FEEDBACK, FEEDBACK_RECEIVED} from '../actions';

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* fetchFeedbackAsync(action) {
  try {
    console.log('DD:' + action.param.year);
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
    console.log(error);
  }
}

// Watcher: Increase Counter Async
export function* watchGetFeedback() {
  yield takeLatest(GET_FEEDBACK, fetchFeedbackAsync);
}
