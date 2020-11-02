import {all, fork} from 'redux-saga/effects';
import {
  watchGetDashboard,
} from './dashboardSaga';
import {
  watchDoLogin,
  watchForgotPasswordLink,
  watchUpdatePassword,
  watchValidatePasswordLink,
} from './loginInSaga';
import {
  watchGetClosedLoopOwnerDetails,
  watchGetClosedLoopSegmentDetails,
  watchGetDetractorTicketDetail,
} from './ClosedLoopSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([
    fork(watchGetDashboard),
    fork(watchDoLogin),
    fork(watchValidatePasswordLink),
    fork(watchUpdatePassword),
    fork(watchGetDetractorTicketDetail),
    fork(watchGetClosedLoopSegmentDetails),
    fork(watchGetClosedLoopOwnerDetails),
    fork(watchForgotPasswordLink)
  ]);
}
