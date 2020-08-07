import * as actions from './login.actions';
import {
  GET_FORGOT_PSWD_OTP,
  GET_LOGIN,
  UPDATE_PASSWORD,
  VALIDATE_USER_OTP,
} from './index';

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
});
