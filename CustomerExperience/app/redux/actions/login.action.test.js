import * as actions from './login.action';
import {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  LOGIN_ACCESS_CODE,
  LOGIN_USER,
  CLEAR_LOGIN_USER,
} from './login.action';

describe('Login Action (form field actions)', () => {
  it('should create an action to set login email', () => {
    const email = 'user@example.com';
    const expectedAction = {
      type: LOGIN_EMAIL,
      payload: email,
    };
    expect(actions.setLoginEmail(email)).toEqual(expectedAction);
  });

  it('should create an action to set login password', () => {
    const password = 'secret123';
    const expectedAction = {
      type: LOGIN_PASSWORD,
      payload: password,
    };
    expect(actions.setLoginPassword(password)).toEqual(expectedAction);
  });

  it('should create an action to set login access code', () => {
    const accessCode = 'ACC001';
    const expectedAction = {
      type: LOGIN_ACCESS_CODE,
      payload: accessCode,
    };
    expect(actions.setLoginAccessCode(accessCode)).toEqual(expectedAction);
  });

  it('should create an action to set login user', () => {
    const user = {email: 'user@example.com', password: 'secret', accessCode: 'ACC001'};
    const expectedAction = {
      type: LOGIN_USER,
      payload: user,
    };
    expect(actions.setLoginUser(user)).toEqual(expectedAction);
  });

  it('should create an action to clear login user', () => {
    const expectedAction = {
      type: CLEAR_LOGIN_USER,
    };
    expect(actions.clearLoginUser()).toEqual(expectedAction);
  });
});
