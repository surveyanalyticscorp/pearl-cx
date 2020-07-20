// Imports: Dependencies
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {UPDATE_FEEDBACK, FEEDBACK_UPDATED} from '../actions';

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* fetchFeedbackAsync(action) {
  try {
    console.log('DD fetchFeedbackAsync:' + action.param);
    const json = yield WebServiceHandler.post(
      BASE_URL + 'a/nativehtml/cx.CXAddOrUpdateTicket',
      {'Auth-Token': action.token},
      action.param,
    );

    // Dispatch Action To Redux Store
    yield put({
      type: FEEDBACK_UPDATED,
      response: json,
    });
  } catch (error) {
    console.log(error);
  }
}

// Watcher: Increase Counter Async
export function* watchUpdateFeedback() {
  yield takeLatest(UPDATE_FEEDBACK, fetchFeedbackAsync);
}
