import {all, fork} from 'redux-saga/effects';
import {
  watchGetDashboard,
} from './dashboardSaga';
import {
  watchDoLogin,
  watchForgotPasswordOtp,
  watchValidateUserOtp,
  watchUpdatePassword,
} from './loginInSaga';
import {
  watchGetClosedLoopOwnerDetails,
  watchGetClosedLoopSegmentDetails,
  watchGetDetractorTicketDetail,
} from './ClosedLoopSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([
    // fork(watchGetFeedback),
    fork(watchGetDashboard),
    fork(watchDoLogin),
    fork(watchForgotPasswordOtp),
    fork(watchValidateUserOtp),
    fork(watchUpdatePassword),
    // fork(watchUpdateFeedback),
    fork(watchGetDetractorTicketDetail),
    fork(watchGetClosedLoopSegmentDetails),
    fork(watchGetClosedLoopOwnerDetails)
  ]);
}
