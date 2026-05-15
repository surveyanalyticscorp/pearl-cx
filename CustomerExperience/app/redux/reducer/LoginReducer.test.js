import loginReducer from './LoginReducer';
import {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  LOGIN_ACCESS_CODE,
  LOGIN_USER,
  CLEAR_LOGIN_USER,
} from '../actions/login.action';

describe('Login Reducer', () => {
  const initialState = {
    email: '',
    password: '',
    accessCode: '',
  };

  it('should return the initial state', () => {
    expect(loginReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle LOGIN_EMAIL', () => {
    expect(
      loginReducer(initialState, {
        type: LOGIN_EMAIL,
        payload: 'user@example.com',
      }),
    ).toEqual({
      email: 'user@example.com',
      password: '',
      accessCode: '',
    });
  });

  it('should handle LOGIN_PASSWORD', () => {
    expect(
      loginReducer(initialState, {
        type: LOGIN_PASSWORD,
        payload: 'secret123',
      }),
    ).toEqual({
      email: '',
      password: 'secret123',
      accessCode: '',
    });
  });

  it('should handle LOGIN_ACCESS_CODE', () => {
    expect(
      loginReducer(initialState, {
        type: LOGIN_ACCESS_CODE,
        payload: 'ACC001',
      }),
    ).toEqual({
      email: '',
      password: '',
      accessCode: 'ACC001',
    });
  });

  it('should handle LOGIN_USER and extract fields from payload', () => {
    const user = {email: 'user@example.com', password: 'secret', accessCode: 'ACC001'};
    expect(
      loginReducer(initialState, {
        type: LOGIN_USER,
        payload: user,
      }),
    ).toEqual({
      email: 'user@example.com',
      password: 'secret',
      accessCode: 'ACC001',
    });
  });

  it('should handle LOGIN_USER with missing fields gracefully', () => {
    expect(
      loginReducer(initialState, {
        type: LOGIN_USER,
        payload: {},
      }),
    ).toEqual({
      email: undefined,
      password: undefined,
      accessCode: undefined,
    });
  });

  it('should handle CLEAR_LOGIN_USER and reset all fields', () => {
    const filledState = {email: 'user@example.com', password: 'secret', accessCode: 'ACC001'};
    expect(
      loginReducer(filledState, {
        type: CLEAR_LOGIN_USER,
      }),
    ).toEqual({
      email: '',
      password: '',
      accessCode: '',
    });
  });

  it('should return current state for unknown action type', () => {
    const currentState = {email: 'user@example.com', password: 'pass', accessCode: 'ACC'};
    expect(
      loginReducer(currentState, {type: 'UNKNOWN_ACTION'}),
    ).toEqual(currentState);
  });
});
