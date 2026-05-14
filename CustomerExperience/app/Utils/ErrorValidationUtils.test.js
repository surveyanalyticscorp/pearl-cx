import {getApiValidationErrorMessage} from './ErrorValidationUtils';

describe('getApiValidationErrorMessage', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return errorAlert when present', () => {
    const error = {errorAlert: 'Email is invalid'};
    expect(getApiValidationErrorMessage(error)).toBe('Email is invalid');
  });

  it('should return session expired message when message contains "jwt expired"', () => {
    const error = {message: 'jwt expired'};
    expect(getApiValidationErrorMessage(error)).toBe(
      'Session expired, please login again',
    );
  });

  it('should return the message when it does not contain "jwt expired"', () => {
    const error = {message: 'Network error'};
    expect(getApiValidationErrorMessage(error)).toBe('Network error');
  });

  it('should return "Error" when neither errorAlert nor message is present', () => {
    const error = {};
    expect(getApiValidationErrorMessage(error)).toBe('Error');
  });

  it('should log the error with the identifier', () => {
    const error = {errorAlert: 'Some error'};
    getApiValidationErrorMessage(error, 'TestIdentifier');
    expect(console.log).toHaveBeenCalledWith(
      'getApiValidationErrorMessage TestIdentifier',
      JSON.stringify(error),
    );
  });

  it('should use "default" as the logIdentifier when not provided', () => {
    const error = {errorAlert: 'Some error'};
    getApiValidationErrorMessage(error);
    expect(console.log).toHaveBeenCalledWith(
      'getApiValidationErrorMessage default',
      JSON.stringify(error),
    );
  });
});
