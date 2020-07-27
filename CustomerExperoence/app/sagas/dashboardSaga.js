// Imports: Dependencies
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {
  DASHBOARD_RECEIVED,
  GET_DASHBOARD,
  API_ERROR,
  DETRACTOR_TICKET_RECEIVED,
  IS_LOADING,
  GET_DETRACTOR_TICKET,
} from '../actions';

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
    console.log('Dashboard saga error:' + JSON.stringify(error));
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

// Watcher: Increase Counter Async
export function* watchGetDashboard() {
  yield takeLatest(GET_DASHBOARD, fetchDashboardAsync);
}

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* fetchDetractorTicketAsync(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
      BASE_URL + 'a/nativehtml/cx.CXDetractorTicket',
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: DETRACTOR_TICKET_RECEIVED,
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

// Watcher: Increase Counter Async
export function* watchGetDetractorTicket() {
  yield takeLatest(GET_DETRACTOR_TICKET, fetchDetractorTicketAsync);
}
