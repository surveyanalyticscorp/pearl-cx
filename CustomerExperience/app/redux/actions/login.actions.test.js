import * as actions from './login.actions';
import {
  GET_LOGIN,
  AUTHENTICATE_PANEL,
  GET_BEARER_TOKEN,
  GET_RESET_PASSWORD_LINK,
  UPDATE_PASSWORD,
  VALIDATE_RESET_PASSWORD_LINK,
  SET_BASE_URL,
  SET_ACCESS_CODE,
  UPDATE_BASE_URL,
  UPDATE_BASE_CLF_URL,
  LOGOUT,
  CLEAR_RESET_PASSWORD_LINK_RESPONSE,
} from './login.actions';

describe('Login Actions (saga triggers)', () => {
  it('should create an action to authenticate panel', () => {
    const param = {panelId: 'p1'};
    expect(actions.authenticatePanel(param)).toEqual({
      type: AUTHENTICATE_PANEL,
      param,
    });
  });

  it('should create an action to do login', () => {
    const param = {email: 'user@example.com', password: 'secret'};
    expect(actions.doLogin(param)).toEqual({
      type: GET_LOGIN,
      param,
    });
  });

  it('should create an action to get CLF auth token', () => {
    const param = {token: 'abc'};
    expect(actions.getClfAuth(param)).toEqual({
      type: GET_BEARER_TOKEN,
      param,
    });
  });

  it('should create an action to request password reset link', () => {
    const param = {email: 'user@example.com'};
    expect(actions.requestPasswordLink(param)).toEqual({
      type: GET_RESET_PASSWORD_LINK,
      param,
    });
  });

  it('should create an action to update password', () => {
    const param = {newPassword: 'newSecret', token: 'reset-token'};
    expect(actions.updatePassword(param)).toEqual({
      type: UPDATE_PASSWORD,
      param,
    });
  });

  it('should create an action to validate reset password link', () => {
    const param = {linkToken: 'link-token'};
    expect(actions.validateResetPasswordLink(param)).toEqual({
      type: VALIDATE_RESET_PASSWORD_LINK,
      param,
    });
  });

  it('should create an action to set base URL', () => {
    const baseUrl = 'https://api.example.com';
    expect(actions.setBaseUrl(baseUrl)).toEqual({
      type: SET_BASE_URL,
      baseUrl,
    });
  });

  it('should create an action to set access code', () => {
    const accessCode = 'ACC123';
    expect(actions.setAccessCode(accessCode)).toEqual({
      type: SET_ACCESS_CODE,
      accessCode,
    });
  });

  it('should create an action to update base URL', () => {
    const param = {url: 'https://new.example.com'};
    expect(actions.updateBaseUrl(param)).toEqual({
      type: UPDATE_BASE_URL,
      param,
    });
  });

  it('should create an action to update CLF base URL', () => {
    const clfBaseUrl = 'https://clf.example.com';
    expect(actions.updateClfBaseUrl(clfBaseUrl)).toEqual({
      type: UPDATE_BASE_CLF_URL,
      clfBaseUrl,
    });
  });

  it('should create an action to do logout', () => {
    const token = 'auth-token';
    const param = {userId: 'user123'};
    expect(actions.doLogout(token, param)).toEqual({
      type: LOGOUT,
      token,
      param,
    });
  });

  it('should create an action to clear reset password link response', () => {
    expect(actions.clearResetPasswordLinkResponse()).toEqual({
      type: CLEAR_RESET_PASSWORD_LINK_RESPONSE,
    });
  });
});
