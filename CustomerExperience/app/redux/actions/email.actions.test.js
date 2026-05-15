import * as actions from './email.actions';
import {
  CLEAR_EMAIL_DATA,
  SET_EMAIL_SUBJECT,
  SET_EMAIL_BODY,
  SET_EMAIL_DATA,
  TOGGLE_TEMPLATE_BOTTOM_SHEET,
} from './email.actions';

describe('Email Actions', () => {
  it('should create an action to clear email data', () => {
    const expectedAction = {
      type: CLEAR_EMAIL_DATA,
    };
    expect(actions.CLEAR_EMAIL_DATA_ACTION()).toEqual(expectedAction);
  });

  it('should create an action to set email subject', () => {
    const emailSubject = 'Hello there';
    const expectedAction = {
      type: SET_EMAIL_SUBJECT,
      emailSubject,
    };
    expect(actions.setEmailSubject(emailSubject)).toEqual(expectedAction);
  });

  it('should create an action to set email body', () => {
    const emailBody = 'Body content here';
    const expectedAction = {
      type: SET_EMAIL_BODY,
      emailBody,
    };
    expect(actions.setEmailBody(emailBody)).toEqual(expectedAction);
  });

  it('should create an action to set email data', () => {
    const emailData = {to: 'user@example.com', subject: 'Hi', body: 'Hello'};
    const expectedAction = {
      type: SET_EMAIL_DATA,
      emailData,
    };
    expect(actions.setEmailData(emailData)).toEqual(expectedAction);
  });

  it('should create an action to toggle template bottom sheet', () => {
    const isOpen = true;
    const expectedAction = {
      type: TOGGLE_TEMPLATE_BOTTOM_SHEET,
      isOpen,
    };
    expect(actions.setTemplateBottomSheetState(isOpen)).toEqual(expectedAction);
  });
});
