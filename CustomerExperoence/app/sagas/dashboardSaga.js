// Imports: Dependencies
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {DASHBOARD_RECEIVED, GET_DASHBOARD} from '../actions';

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* fetchDashboardAsync(action) {
  try {
    const json = yield WebServiceHandler.post(
      BASE_URL + 'a/nativehtml/cx.CXHome',
      {'Auth-Token': action.token},
      {},
    );

    // Dispatch Action To Redux Store
    yield put({
      type: DASHBOARD_RECEIVED,
      response: json,
    });
  } catch (error) {
    console.log(error);
  }
}

// Watcher: Increase Counter Async
export function* watchGetDashboard() {
  yield takeLatest(GET_DASHBOARD, fetchDashboardAsync);
}
