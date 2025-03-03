import {isValidInput} from './useForgotPasswordProcess';
import {
  showErrorFlashMessage,
  validateEmail,
  isStringNullOrEmpty,
} from '../../../../Utils/Utility';

jest.mock('../../../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
  validateEmail: jest.fn(),
  isStringNullOrEmpty: jest.fn(),
}));

describe('isValidInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true if data is valid', () => {
    // Mock the validation check
    // or you can rely on the real `validateForgotPasswordData`
    // if you want a full integration test.
    validateEmail.mockReturnValue(true);
    const mockData = {email: 'testyser@gmail.com', accessCode: '1234'};
    expect(isValidInput(mockData)).toBe(true);
    expect(showErrorFlashMessage).not.toHaveBeenCalled();
  });

  it('returns false and shows error if email is invalid', () => {
    validateEmail.mockReturnValue(false);

    const mockData = {email: 'invalid-email', accessCode: '1234'};

    expect(isValidInput(mockData)).toBe(false);
    expect(showErrorFlashMessage).toHaveBeenCalledTimes(1);
  });
});
