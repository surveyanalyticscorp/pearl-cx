// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas

import {watchGetFeedback, watchUpdateFeedback} from './feedbackSaga';
import {watchGetDashboard, watchGetDetractorTicket, watchGetStoreDashboard} from './dashboardSaga';
import {watchDoLogin} from './loginInSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([
    fork(watchGetFeedback),
    fork(watchGetDashboard),
    fork(watchDoLogin),
    fork(watchUpdateFeedback),
    fork(watchGetDetractorTicket),
    fork(watchGetStoreDashboard),
  ]);
}
