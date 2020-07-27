// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas

import {watchGetFeedback, watchUpdateFeedback} from './feedbackSaga';
import {
  watchGetDashboard,
  watchGetDetractorTicket,
  watchGetStoreDashboard,
} from './dashboardSaga';
import {
  watchDoLogin,
  watchForgotPasswordOtp,
  watchValidateUserOtp,
} from './loginInSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([
    fork(watchGetFeedback),
    fork(watchGetDashboard),
    fork(watchDoLogin),
    fork(watchForgotPasswordOtp),
    fork(watchValidateUserOtp),
    fork(watchUpdateFeedback),
    fork(watchGetDetractorTicket),
    fork(watchGetStoreDashboard),
  ]);
}
