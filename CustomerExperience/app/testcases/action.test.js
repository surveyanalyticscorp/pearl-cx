import * as actions from '../redux/actions/login.actions';
import * as feedbackActions from '../redux/actions/feedback.actions';
import * as dashboardActions from '../redux/actions/dashboard.actions';
import {
  GET_FORGOT_PSWD_OTP,
  GET_LOGIN,
  UPDATE_PASSWORD,
  VALIDATE_USER_OTP,
} from '../redux/actions';
import {GET_FEEDBACK} from '../redux/actions/feedback.actions';
import {FEEDBACK_UPDATED} from '../redux/actions/feedback.actions';
import {UPDATE_FEEDBACK} from '../redux/actions/feedback.actions';
import {GET_DASHBOARD} from '../redux/actions/dashboard.actions';

describe('ACTIONS', () => {
  it('should create an action with correct type', () => {
    const expectedAction = {
      type: GET_LOGIN,
    };
    expect(actions.doLogin()).toEqual(expectedAction);
  });

  it('should create an action with correct type GET_FORGOT_PSWD_OTP', () => {
    const expectedAction = {
      type: GET_FORGOT_PSWD_OTP,
    };
    expect(actions.requestOtp()).toEqual(expectedAction);
  });

  it('should create an action with correct type UPDATE_PASSWORD', () => {
    const expectedAction = {
      type: UPDATE_PASSWORD,
    };
    expect(actions.updatePassword()).toEqual(expectedAction);
  });

  it('should create an action with correct type validateUserOtp', () => {
    const expectedAction = {
      type: VALIDATE_USER_OTP,
    };
    expect(actions.validateUserOtp()).toEqual(expectedAction);
  });

  // it('should create an action with correct type getFeedbackList', () => {
  //   const expectedAction = {
  //     type: GET_FEEDBACK,
  //   };
  //   expect(feedbackActions.getFeedbackList()).toEqual(expectedAction);
  // });
  // it('should create an action with correct type cleanUpdateFeedBack', () => {
  //   const expectedAction = {
  //     type: FEEDBACK_UPDATED,
  //     response: {},
  //   };
  //   expect(feedbackActions.cleanUpdateFeedBack()).toEqual(expectedAction);
  // });
  // it('should create an action with correct type updateFeedback', () => {
  //   const expectedAction = {
  //     type: UPDATE_FEEDBACK,
  //   };
  //   expect(feedbackActions.updateFeedback()).toEqual(expectedAction);
  // });
  it('should create an action with correct type dashboardActions', () => {
    const expectedAction = {
      type: GET_DASHBOARD,
    };
    expect(dashboardActions.getDashboardContent()).toEqual(expectedAction);
  });
});
