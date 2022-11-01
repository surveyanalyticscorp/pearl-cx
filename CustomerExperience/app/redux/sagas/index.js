import {all, fork} from 'redux-saga/effects';
import {watchGetDashboard} from './dashboardSaga';
import {
  watchAuthenticatePanel,
  watchDoLogin,
  watchForgotPasswordLink,
  watchLogout,
  watchUpdatePassword,
  watchValidatePasswordLink,
} from './loginInSaga';
import {
  watchGetClosedLoopOwnerDetails,
  watchGetClosedLoopSegmentDetails,
  watchGetDetractorTicketDetail,
  watchGetClosedLoopTicketList,
} from './ClosedLoopSaga';
import {watchGetNotification} from './notificationSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([
    fork(watchGetDashboard),
    fork(watchGetNotification),
    fork(watchAuthenticatePanel),
    fork(watchDoLogin),
    fork(watchValidatePasswordLink),
    fork(watchUpdatePassword),
    fork(watchGetDetractorTicketDetail),
    fork(watchGetClosedLoopSegmentDetails),
    fork(watchGetClosedLoopTicketList),
    fork(watchGetClosedLoopOwnerDetails),
    fork(watchForgotPasswordLink),
    fork(watchLogout),
  ]);
}
