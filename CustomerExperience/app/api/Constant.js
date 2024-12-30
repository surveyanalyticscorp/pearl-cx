export const ASYNC_AUTH_TOKEN = 'authToken';
export const ASYNC_BEARER_TOKEN = 'bearerToken';

export const ASYNC_USER_INFO = 'userInfo';
export const ASYNC_USER_CREDENTIALS = 'userCredentials';
export const ASYNC_RESET_CREDENTIALS = 'resetCredentials';
export const ASYNC_PUSH_TOKEN = 'pushtoken';
export const BASE_URL = 'baseUrl';
export const ASYNC_CLF_BASE_URL = 'clfBaseUrl';
export const ACCESS_CODE = 'ACCESS_CODE';
export const SUBSCRIBER_ID = 'subscriberId';
export const ASYNC_LAST_LOGIN = 'lastLogin';
export const ASYNC_LOGIN_EXPIRE_DATE = 'expiredLoginDate';
export const ACTION_EMAIL = 'noreply@InsightsHub.com';
export const ASYNC_RESPONSES_WITH_CX_MANAGER = 'ASYNC_RESPONSES';
export const ASYNC_LOGGED_IN_ALREADY = 'loogedInAlready';
export const ASYNC_APP_USAGE_TIME_TRACK_DATA =
  'ASYNC_APP_USAGE_TIME_TRACK_DATA';

export const TOKEN_VALIDATION_DURATION = 5;
export const RESPONSE_READ_UNREAD_FEATURE_ACTIVATION_DATE = 'Jun 1 2024';
export const MAX_COMMENT_LENGTH = 240;
// set true for DEV, false for LIVE
export const IS_DEV_MODE = false;

// export const BASE_URL = 'https://api.questionpro.com/';

// uncomment below lines to connect to dev servers
// export const DEV_BASE_URL = 'https://qa.questionpro.com';
// export const DEV_BASE_URL = 'https://cxlabs.questionpro.com';
export const DEV_BASE_URL = 'https://cxlabs3.questionpro.com/a/nativehtml';

// for DEV
// export const CLF_BASE_URL = 'https://clfqa-backend.questionpro.com/api/';

// for LIVE
export const CLF_BASE_URL = `https://${
  IS_DEV_MODE ? 'clfqa' : 'clf'
}-backend.questionpro.com/api`;

export const INIT_BASE = 'https://api.questionpro.com';
// export const BASE_URL_MID_FIX = '/a/nativehtml';
export const BASE_URL_NEW_MID_FIX = '/a/api/nativehtml';

export const PANEL_AUTH = '/panel.auth.PanelRequestHandler';
export const PANEL_AUTH_v2 =
  'https://api.questionpro.com/panel.auth.PanelRequestHandler';
export const AUTH_LOGIN = '/cx.auth.CXLogin';
export const CX_LOGOUT = '/cx.auth.CXLogout';

export const CX_GET_RESET_PASSWORD_LINK = '/cx.auth.CXForgotPasswordLink';
export const CX_VALIDATE_PASSWORD_LINK = '/cx.auth.ValidatePasswordLinkExpiry';
export const AUTH_UPDATE_PASSWORD = '/cx.auth.CXUpdatePassword';

export const CX_HOME = '/cx.CXHome';
export const CX_DETRACTOR_TICKETS = '/cx.CXDetractorTicket';
export const CX_GET_ALL_RESPONSE = '/cx.CXGetAllResponses';

export const CX_GET_PANEL_MEMBER = '/cx.CXPanelMemberProfile';
export const CX_RESPONSE_TICKET_DETAILS = '/cx.CXTicketDetails';
export const CX_RESPONSE_SURVEY_DETAILS = '/cx.SurveyResponseDetails';
export const CX_RESPONSE_DETAILS_BY_RESPONSEID =
  '/cx.CXGetResponseByResponseSetID';

//export const CX_ADD_UPDATE_TICKET = 'a/nativehtml/cx.CXAddOrUpdateTicket';

export const CX_GET_CLOSED_LOOP_TICKET_DETAILS =
  '/cx.closedloop.CXGetTicketDetails';
// export const CX_GET_CLOSED_LOOP_SEGMENT_DETAILS =
//   '/cx.closedloop.CXGetSegmentByStatus';
export const CX_GET_CLOSED_LOOP_SEGMENT_DETAILS =
  '/cx.closedloop.CXGetAllSegment';
export const CX_GET_CLOSED_LOOP_OWNER_DETAILS =
  '/cx.closedloop.CXGetOwnerBySegment';
export const CX_GET_CLOSED_LOOP_SEGMENT_AND_OWNER_BY_FEEDBACK =
  '/cx.closedloop.CXGetSegmentAndOwnerByFeedback';
export const CX_UPDATE_CLOSED_LOOP_TICKET = '/cx.closedloop.CXUpdateTicket';
export const CX_ADD_CLOSED_LOOP_TICKET = '/cx.CXAddTicket';

export const CX_GET_NOTIFICATION_LIST = '/cx.CXGetNotificationLogs';
export const CX_CLEAR_NOTIFICATION_LOGS = '/cx.CXClearNotificationLogs';
export const CX_WELCOME_SCREEN_DATA = '/cx.CXWelcomeScreenDataCount';

// CLF 3.0 APIs

export const CLF_LOGIN = '/mobile/auth/login';

// base-url?dataCenter=us
export const CLF_GET_BASE_URL = `${CLF_BASE_URL}/base-url`;

// export const FEEDBACK_API_KEY = 'e8caf096-4f19-4b34-a7cd-4bcaa8197c1d';
export const FEEDBACK_API_KEY_ENDPOINT = '?feedbackApiKey=';
export const syncTicketList = feedBackId =>
  `/mobile/tickets/import/feedback/${feedBackId}`;
// export const CLF_GET_TICKET_lIST_SYNC_PREFIX = `${CLF_BASE_URL}/tickets/import/feedback/`;
// export const CLF_GET_TICKET_lIST_SYNC_POSTFIX = `/mobile`;

// /tickets/import/feedback/25697/mobile?subscriberId=4896658&feedbackApiKey=eba03e1f-d8d0-4f1f-8752-70893eac665c
export const CLF_GET_TICKET_LIST = '/mobile/tickets/feedback/';
export function getClfTicketListUrl(feedBackId, segmentId) {
  return CLF_GET_TICKET_LIST + feedBackId + '/' + SEGMENT + segmentId;
}
export const CLF_GET_GLOBAL_SETTINGS = `/mobile/global-setting`;

// "ex: {{BASE_URL}}/mobile/tickets/feedback/:feedBackId/segment/:segmentId?fromDate=2022-09-28&toDate=2022-10-28"
export const CLF_GET_TICKET_LIST_BY_RESPONSEID = '/mobile/tickets/feedbacks/';
// ex: {{BASE_URL}}/mobile/tickets/feedbacks/{feedbackId}/responses/{responseId}?feedbackApiKey=95e89018-22a9-4a23-b774-ee0041010813

export const CLF_GET_TICKET_DETAILS = '/mobile/tickets/';
// ex: {{BASE_URL}}/mobile/tickets/:ticketId

export const CLF_STATUS_WISE_PRIORITY_ANALYTICS =
  '/mobile/tickets/status-wise-priority/segments/';
export const CLF_WELCOME_SCREEN_COUNTS = '/mobile/tickets/analytics/status';

export const CLF_GET_DEFAULT_EMAIL_TEMPLATE =
  '/mobile/action-template/get-default';
export const CLF_GET_EMAIL_TEMPLATES = '/mobile/action-template';
export const CLF_SEND_EMAIL_PREFIX = '/mobile/tickets/'; ///mobile/tickets/:ticketId/actionMail
export const CLF_SEND_EMAIL_POSTFIX = '/actionMail';

export const CLF_MEDIA_UPLOAD = '/mobile/media/upload';

export const CLF_LATEST_COMMENT_BY_TICKET_ID_PREFIX = '/mobile/tickets/';
export const CLF_LATEST_COMMENT_BY_TICKET_ID_POSTFIX = '/latest-comment';

export const CLF_STATUS_HISTORY_BY_PREFIX = '/mobile/tickets/';
export const CLF_STATUS_HISTORY_BY_POSTFIX = '/last-status-history';

// export const CLF_GET_ROOT_CAUSE_PREFIX = `${CLF_BASE_URL}/rootCause/subscribers/`; // subscriberId
// export const CLF_GET_ROOT_CAUSE_POSTFIX = '/mobile';

export const CLF_GET_ROOT_CAUSE = '/mobile/root-cause';
// /mobile/root-cause
// export const CLF_GET_ROOT_CAUSE_ACTIONS_PREFIX = `${CLF_BASE_URL}/root-cause-action/subscribers/`; // subscriberId
// export const CLF_GET_ROOT_CAUSE_ACTIONS_POSTFIX = '/mobile';

export const CLF_GET_ROOT_CAUSE_ACTIONS = '/mobile/root-cause-action'; // subscriberId
// /mobile/root-cause-action

export const CLF_UPDATE_ROOT_CAUSE_PREFIX = '/mobile/tickets/'; // ticketId
export const CLF_UPDATE_ROOT_CAUSE_POSTFIX = '/update-root-causes';

// /mobile/tickets/subscribers/:subscriberId/tickets/:ticketId
export const CLF_DELETE_TICKET_PREFIX = '/mobile/tickets/subscribers/';
export const CLF_DELETE_TICKET_POSTFIX = '/tickets/';

// /mobile/tickets/bulk-delete
export const CLF_DELETE_TICKETS = '/mobile/tickets/bulk-delete';

export const CLF_APP_LOGIN_COUNT = '/app-login-count';

export const CLF_GET_ACTION_HISTORY_PREFIX = `/mobile/tickets/`;
export const CLF_GET_ACTION_SUMMARY_POSTFIX = `/action-mail`;
export const CLF_GET_ACTION_DETAILS_POSTFIX = `/action-mails`;

export const EMAIL = 'email';
export const PHONE = 'phone';

export const FEEDBACK = 'feedback/';
export const SEGMENT = 'segment/';
export const COMMNETS = 'comments/';
export const ACTIVITY_LOG = 'activity-log/';
export const RESPONSES = 'responses/';
export const ESCALATE = '/escalate';

export const CX_DASHBOARD = 'CX_DASHBOARD';
export const CX_DETRACTOR_TICKETS_NEW = 'CX_DETRACTOR_TICKETS_NEW';
export const CX_DETRACTOR_TICKETS_PENDING = 'CX_DETRACTOR_TICKETS_PENDING';
export const CX_DETRACTOR_TICKETS_RESOLVED = 'CX_DETRACTOR_TICKETS_RESOLVED';
export const CX_FEEDBACK_LIST = 'CX_FEEDBACK_LIST';
export const CX_FEEDBACK_SELECTED = 'CX_FEEDBACK_SELECTED';
export const CX_FEEDBACK_UPDATED = 'CX_FEEDBACK_UPDATED';
export const LOADING_PROGRESS = 'LOADING_PROGRESS';
export const LOADING_ERROR = 'ERROR';
export const SUCCESS = 'success';
export const EMAIL_PATTERN =
  "^[A-Za-z0-9][\\'A-Za-z0-9_+/-]*(\\.[\\'_A-Za-z0-9-+/]+)*@((([a-zA-Z]+)?\\.[a-zA-Z]+-[a-zA-Z]+\\.[A-Za-z]{2,})|([A-Za-z0-9]([A-Za-z0-9_-]*)(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})))";

export const SEGMENT_SELECTOR = 'segmentSelector';
export const fakeBearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTc2NTIsIm9yZ0lkIjo1MjAwODgxLCJjeFVzZXJJZCI6OTc2NTIsImZpcnN0TmFtZSI6IkFubW9sIiwibGFzdE5hbWUiOiIiLCJlbWFpbEFkZHJlc3MiOiJhbm1vbC5zYWhldHlhKzIxQHF1ZXN0aW9ucHJvLmNvbSIsImZlZWRiYWNrSWQiOjM1MDkwLCJmZWVkYmFja05hbWUiOiJMaXZlIFN1cnZleXMiLCJzdWJzY3JpYmVySWQiOjUzMzEzNjMsInN1YnNjcmliZXJFbWFpbEFkZHJlc3MiOiJhbm1vbC5zYWhldHlhKzIxQHF1ZXN0aW9ucHJvLmNvbSIsInJvbGUiOjAsImFwcFR5cGUiOjEsImlhdCI6MTcwNDg2Mjg5MSwiZXhwIjoxNzA1Mjk0ODkxfQ.2Cfya0yVMHPItA_cElgi3NgSHgNf-sPQC2R1cGItvL4';
