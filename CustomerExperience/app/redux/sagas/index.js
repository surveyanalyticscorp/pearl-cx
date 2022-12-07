import {all, fork} from 'redux-saga/effects';
import {watchDataCount, watchGetDashboard} from './dashboardSaga';
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
  watchGetClosedLoopTicketItem,
  watchGetClosedLoopTicketComments,
  watchGetClosedLoopTicketActivity,
  watchPostTicketComment,
  watchPostCreateTicket,
  watchPatchUpdateTicket,
  watchGetDefaultEmailTemplate,
  watchGetEmailTemplates,
  watchSendEmail,
  watchGetClosedLoopAllOwners,
} from './ClosedLoopSaga';
import {watchGetNotification} from './notificationSaga';

// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([
    fork(watchGetDashboard),
    fork(watchDataCount),
    fork(watchGetNotification),
    fork(watchAuthenticatePanel),
    fork(watchDoLogin),
    fork(watchValidatePasswordLink),
    fork(watchUpdatePassword),
    fork(watchGetDetractorTicketDetail),
    fork(watchGetClosedLoopSegmentDetails),
    fork(watchGetClosedLoopTicketList),
    fork(watchGetClosedLoopTicketItem),
    fork(watchGetClosedLoopTicketComments),
    fork(watchGetClosedLoopTicketActivity),
    fork(watchGetClosedLoopOwnerDetails),
    fork(watchGetClosedLoopAllOwners),
    fork(watchForgotPasswordLink),
    fork(watchLogout),
    fork(watchPostTicketComment),
    fork(watchPostCreateTicket),
    fork(watchPatchUpdateTicket),
    fork(watchGetDefaultEmailTemplate),
    fork(watchGetEmailTemplates),
    fork(watchSendEmail),
  ]);
}
