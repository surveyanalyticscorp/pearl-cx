export const ASYNC_AUTH_TOKEN = 'authToken';
export const ASYNC_USER_INFO = 'userInfo';
export const ASYNC_USER_CREDENTIALS = 'userCredentials';
export const ASYNC_RESET_CREDENTIALS = 'resetCredentials';
export const ASYNC_PUSH_TOKEN = 'pushtoken';
export const BASE_URL = 'baseUrl';
export const SUBSCRIBER_ID = 'subscriberId';
export const ASYNC_LAST_LOGIN = 'lastLogin';
export const ACTION_EMAIL = 'noreply@InsightsHub.com';
// set true for DEV, false for LIVE
export const IS_DEV_MODE = false;

// export const BASE_URL = 'https://api.questionpro.com/';

// uncomment below lines to connect to dev servers
export const DEV_BASE_URL = 'https://qa.questionpro.com';
// export const DEV_BASE_URL = 'https://cxlabs.questionpro.com';

// for DEV
// export const CLF_BASE_URL = 'https://clfqa-backend.questionpro.com/api/';

// for LIVE
export const CLF_BASE_URL = `https://${
  IS_DEV_MODE ? 'clfqa' : 'clf'
}-backend.questionpro.com/api/`;

export const PANEL_AUTH =
  'https://api.questionpro.com/a/nativehtml/panel.auth.PanelRequestHandler';
export const AUTH_LOGIN = '/a/nativehtml/cx.auth.CXLogin';
export const CX_LOGOUT = '/a/nativehtml/cx.auth.CXLogout';

export const CX_GET_RESET_PASSWORD_LINK =
  '/a/nativehtml/cx.auth.CXForgotPasswordLink';
export const CX_VALIDATE_PASSWORD_LINK =
  '/a/nativehtml/cx.auth.ValidatePasswordLinkExpiry';
export const AUTH_UPDATE_PASSWORD = '/a/nativehtml/cx.auth.CXUpdatePassword';

export const CX_HOME = '/a/nativehtml/cx.CXHome';
export const CX_DETRACTOR_TICKETS = '/a/nativehtml/cx.CXDetractorTicket';
export const CX_GET_ALL_RESPONSE = '/a/nativehtml/cx.CXGetAllResponses';

export const CX_GET_PANEL_MEMBER = '/a/nativehtml/cx.CXPanelMemberProfile';
export const CX_RESPONSE_TICKET_DETAILS = '/a/nativehtml/cx.CXTicketDetails';
export const CX_RESPONSE_SURVEY_DETAILS =
  '/a/nativehtml/cx.SurveyResponseDetails';
export const CX_RESPONSE_DETAILS_BY_RESPONSEID =
  '/a/nativehtml/cx.CXGetResponseByResponseSetID';

//export const CX_ADD_UPDATE_TICKET = 'a/nativehtml/cx.CXAddOrUpdateTicket';

export const CX_GET_CLOSED_LOOP_TICKET_DETAILS =
  '/a/nativehtml/cx.closedloop.CXGetTicketDetails';
// export const CX_GET_CLOSED_LOOP_SEGMENT_DETAILS =
//   '/a/nativehtml/cx.closedloop.CXGetSegmentByStatus';
export const CX_GET_CLOSED_LOOP_SEGMENT_DETAILS =
  '/a/nativehtml/cx.closedloop.CXGetAllSegment';
export const CX_GET_CLOSED_LOOP_OWNER_DETAILS =
  '/a/nativehtml/cx.closedloop.CXGetOwnerBySegment';
export const CX_GET_CLOSED_LOOP_SEGMENT_AND_OWNER_BY_FEEDBACK =
  '/a/nativehtml/cx.closedloop.CXGetSegmentAndOwnerByFeedback';
export const CX_UPDATE_CLOSED_LOOP_TICKET =
  '/a/nativehtml/cx.closedloop.CXUpdateTicket';
export const CX_ADD_CLOSED_LOOP_TICKET = '/a/nativehtml/cx.CXAddTicket';

export const CX_GET_NOTIFICATION_LIST =
  '/a/nativehtml/cx.CXGetNotificationLogs';
export const CX_CLEAR_NOTIFICATION_LOGS =
  '/a/nativehtml/cx.CXClearNotificationLogs';
export const CX_WELCOME_SCREEN_DATA =
  '/a/nativehtml/cx.CXWelcomeScreenDataCount';

// CLF 3.0 APIs

// export const FEEDBACK_API_KEY = 'e8caf096-4f19-4b34-a7cd-4bcaa8197c1d';
export const FEEDBACK_API_KEY_ENDPOINT = '?feedbackApiKey=';
export const CLF_GET_TICKET_lIST_SYNC = feedBackId =>
  `${CLF_BASE_URL}tickets/import/feedback/${feedBackId}/mobile`;
// export const CLF_GET_TICKET_lIST_SYNC_PREFIX = `${CLF_BASE_URL}/tickets/import/feedback/`;
// export const CLF_GET_TICKET_lIST_SYNC_POSTFIX = `/mobile`;

// /tickets/import/feedback/25697/mobile?subscriberId=4896658&feedbackApiKey=eba03e1f-d8d0-4f1f-8752-70893eac665c
export const CLF_GET_TICKET_LIST = `${CLF_BASE_URL}mobile/tickets/feedback/`;
// "ex: {{BASE_URL}}/mobile/tickets/feedback/:feedBackId/segment/:segmentId?fromDate=2022-09-28&toDate=2022-10-28"
export const CLF_GET_TICKET_LIST_BY_RESPONSEID = `${CLF_BASE_URL}mobile/tickets/feedbacks/`;
// ex: {{BASE_URL}}/mobile/tickets/feedbacks/{feedbackId}/responses/{responseId}?feedbackApiKey=95e89018-22a9-4a23-b774-ee0041010813

export const CLF_GET_TICKET_DETAILS = `${CLF_BASE_URL}mobile/tickets/`;
// ex: {{BASE_URL}}/mobile/tickets/:ticketId

export const CLF_STATUS_WISE_PRIORITY_ANALYTICS = `${CLF_BASE_URL}mobile/tickets/status-wise-priority/segments/`;
export const CLF_WELCOME_SCREEN_COUNTS = `${CLF_BASE_URL}analytics/status/mobile`;

export const CLF_GET_DEFAULT_EMAIL_TEMPLATE = `${CLF_BASE_URL}actionTemplate/get-default/mobile`;
export const CLF_GET_EMAIL_TEMPLATES = `${CLF_BASE_URL}actionTemplate/mobile`;
export const CLF_SEND_EMAIL_PREFIX = `${CLF_BASE_URL}tickets/`;
export const CLF_SEND_EMAIL_POSTFIX = '/actionMail/mobile';

export const CLF_LATEST_COMMENT_BY_TICKET_ID_PREFIX = `${CLF_BASE_URL}comments/tickets/`;
export const CLF_LATEST_COMMENT_BY_TICKET_ID_POSTFIX = '/latest-comment';

export const CLF_STATUS_HISTORY_BY_PREFIX = `${CLF_BASE_URL}tickets/`;
export const CLF_STATUS_HISTORY_BY_POSTFIX = '/last-status-history';

export const CLF_GET_ROOT_CAUSE_PREFIX = `${CLF_BASE_URL}rootCause/subscribers/`; // subscriberId
export const CLF_GET_ROOT_CAUSE_POSTFIX = '/mobile';

export const CLF_GET_ROOT_CAUSE_ACTIONS_PREFIX = `${CLF_BASE_URL}root-cause-action/subscribers/`; // subscriberId
export const CLF_GET_ROOT_CAUSE_ACTIONS_POSTFIX = '/mobile';

export const CLF_UPDATE_ROOT_CAUSE_PREFIX = `${CLF_BASE_URL}mobile/tickets/`; // ticketId
export const CLF_UPDATE_ROOT_CAUSE_POSTFIX = '/update-root-causes';

// /mobile/tickets/subscribers/:subscriberId/tickets/:ticketId
export const CLF_DELETE_TICKET_PREFIX = `${CLF_BASE_URL}mobile/tickets/subscribers/`;
export const CLF_DELETE_TICKET_POSTFIX = `/tickets/`;

// /mobile/tickets/bulk-delete
export const CLF_DELETE_TICKETS = `${CLF_BASE_URL}mobile/tickets/bulk-delete`;

export const CLF_APP_LOGIN_COUNT = `${CLF_BASE_URL}app-login-count`;
// base-url?dataCenter=us
export const CLF_GET_BASE_URL = `${CLF_BASE_URL}base-url`;

export const CLF_GET_ACTION_HISTORY_PREFIX = `${CLF_BASE_URL}mobile/tickets/`;
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
