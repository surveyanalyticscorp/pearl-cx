export const CLEAR_EMAIL_DATA = 'CLEAR_EMAIL_DATA';

export const SET_EMAIL_SUBJECT = 'SET_EMAIL_SUBJECT';
export const SET_EMAIL_BODY = 'SET_EMAIL_BODY';
export const SET_EMAIL_DATA = 'SET_EMAIL_DATA';
export const TOGGLE_TEMPLATE_BOTTOM_SHEET = 'TOGGLE_TEMPLATE_BOTTOM_SHEET';

export const CLEAR_EMAIL_DATA_ACTION = () => {
  return {
    type: CLEAR_EMAIL_DATA,
  };
};

export const setEmailSubject = emailSubject => {
  return {
    type: SET_EMAIL_SUBJECT,
    emailSubject,
  };
};
export const setEmailBody = emailBody => {
  return {
    type: SET_EMAIL_BODY,
    emailBody,
  };
};

export const setEmailData = emailData => {
  return {
    type: SET_EMAIL_DATA,
    emailData,
  };
};

export const setTemplateBottomSheetState = isOpen => {
  return {
    type: TOGGLE_TEMPLATE_BOTTOM_SHEET,
    isOpen,
  };
};
