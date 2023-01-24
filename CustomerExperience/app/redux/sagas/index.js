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
  watchGetLatestComment,
  watchGetTicketStatusHistory,
  watchGetFirstTimeClosedLoopSegmentDetails,
  watchGetrootCauseList,
  watchGetrootCauseActionList,
  watchUpdateRootCause,
} from './ClosedLoopSaga';
import {watchGetNotification} from './notificationSaga';
import {
  watchGetPanelMember,
  watchGetResponseTickets,
  watchGetSurveyResponseDetails,
} from './feedbackSaga';
import {getFirstTimeClosedLoopSegmentDetails} from '../actions/dashboard.actions';

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
    fork(watchGetFirstTimeClosedLoopSegmentDetails),
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
    fork(watchGetrootCauseList),
    fork(watchGetrootCauseActionList),
    fork(watchUpdateRootCause),
    fork(watchGetDefaultEmailTemplate),
    fork(watchGetEmailTemplates),
    fork(watchSendEmail),
    fork(watchGetPanelMember),
    fork(watchGetSurveyResponseDetails),
    fork(watchGetLatestComment),
    fork(watchGetResponseTickets),
    fork(watchGetTicketStatusHistory),
  ]);
}
