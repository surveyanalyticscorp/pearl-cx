// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas

import {watchGetFeedback} from './feedbackSaga';
import {watchGetDashboard} from './dashboardSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([fork(watchGetFeedback, watchGetDashboard)]);
}
