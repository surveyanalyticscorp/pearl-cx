import {all, fork} from 'redux-saga/effects';
import {rootSaga} from './index';

const mockWatcher = jest.fn(function* () {});

jest.mock('./dashboardSaga', () => ({
  watchApploginCount: jest.fn(function* () {}),
  watchDataCount: jest.fn(function* () {}),
  watchGetCLFBaseUrl: jest.fn(function* () {}),
  watchGetDashboard: jest.fn(function* () {}),
  watchGetGlobalSettings: jest.fn(function* () {}),
}));

jest.mock('./loginInSaga', () => ({
  watchAuthenticatePanel: jest.fn(function* () {}),
  watchClfAuth: jest.fn(function* () {}),
  watchDoLogin: jest.fn(function* () {}),
  watchForgotPasswordLink: jest.fn(function* () {}),
  watchLogout: jest.fn(function* () {}),
  watchUpdatePassword: jest.fn(function* () {}),
  watchValidatePasswordLink: jest.fn(function* () {}),
}));

jest.mock('./ClosedLoopSaga', () => ({
  watchGetClosedLoopOwnerDetails: jest.fn(function* () {}),
  watchGetClosedLoopSegmentDetails: jest.fn(function* () {}),
  watchGetDetractorTicketDetail: jest.fn(function* () {}),
  watchGetClosedLoopTicketList: jest.fn(function* () {}),
  watchGetClosedLoopTicketItem: jest.fn(function* () {}),
  watchGetClosedLoopTicketComments: jest.fn(function* () {}),
  watchGetClosedLoopTicketActivity: jest.fn(function* () {}),
  watchPostTicketComment: jest.fn(function* () {}),
  watchPostCreateTicket: jest.fn(function* () {}),
  watchPatchUpdateTicket: jest.fn(function* () {}),
  watchGetDefaultEmailTemplate: jest.fn(function* () {}),
  watchGetEmailTemplates: jest.fn(function* () {}),
  watchSendEmail: jest.fn(function* () {}),
  watchGetClosedLoopAllOwners: jest.fn(function* () {}),
  watchGetLatestComment: jest.fn(function* () {}),
  watchGetTicketStatusHistory: jest.fn(function* () {}),
  watchGetFirstTimeClosedLoopSegmentDetails: jest.fn(function* () {}),
  watchGetrootCauseList: jest.fn(function* () {}),
  watchGetrootCauseActionList: jest.fn(function* () {}),
  watchUpdateRootCause: jest.fn(function* () {}),
  watchSyncTickets: jest.fn(function* () {}),
  watchTicketEscalation: jest.fn(function* () {}),
  watchDeleteTickets: jest.fn(function* () {}),
  watchActionSummary: jest.fn(function* () {}),
  watchActionDetails: jest.fn(function* () {}),
  watchUploadFile: jest.fn(function* () {}),
  watchGetCentralizdRootCause: jest.fn(function* () {}),
  watchGenrateEmailDraft: jest.fn(function* () {}),
  watchGenerateRefinedEmailDraft: jest.fn(function* () {}),
  updateCentralizedRootCause: jest.fn(function* () {}),
  watchUpdateCentralizedRootCause: jest.fn(function* () {}),
  watchGetTaglist: jest.fn(function* () {}),
}));

jest.mock('./notificationSaga', () => ({
  watchGetNotification: jest.fn(function* () {}),
  watchReadNotification: jest.fn(function* () {}),
}));

jest.mock('./feedbackSaga', () => ({
  watchFetchAllResponses: jest.fn(function* () {}),
  watchGetPanelMember: jest.fn(function* () {}),
  watchGetResponseDetailsByResponseId: jest.fn(function* () {}),
  watchGetResponseTickets: jest.fn(function* () {}),
  watchGetSurveyResponseDetails: jest.fn(function* () {}),
}));

describe('rootSaga', () => {
  it('yields an all effect containing fork effects for every watcher', () => {
    const gen = rootSaga();
    const effect = gen.next().value;

    expect(effect).toBeDefined();
    // all() returns an ALL effect descriptor
    expect(effect.type).toBe('ALL');
    // should have many forked watchers
    expect(effect.payload.length).toBeGreaterThan(30);
  });

  it('is done after the single all yield', () => {
    const gen = rootSaga();
    gen.next(); // consume the all yield
    const {done} = gen.next();
    expect(done).toBe(true);
  });
});
