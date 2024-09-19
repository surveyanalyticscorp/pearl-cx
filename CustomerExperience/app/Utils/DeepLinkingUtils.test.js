import {
  handleResetPasswordLink,
  getResetPasswordURLComponents,
} from './DeeplinkingUtils';
import StringUtils from './StringUtils';
import {validateResetPasswordLink} from '../redux/actions/login.actions';

jest.mock('./StringUtils', () => ({
  isNotEmpty: jest.fn(),
}));

jest.mock('../redux/actions/login.actions', () => ({
  validateResetPasswordLink: jest.fn(data => ({
    type: 'VALIDATE_RESET_PASSWORD_LINK',
    payload: data,
  })),
}));

describe('Deeplinking.utils', () => {
  describe('getResetPasswordURLComponents', () => {
    it('should correctly parse the reset password URL components', () => {
      const link =
        'https://example.com/resetpassword?accessCode=1234&email=test@example.com&timestamp=2024-08-28T12:34:56';
      const expectedOutput = {
        email: 'test@example.com',
        accessCode: '1234',
        timestamp: '2024-08-28T12:34:56',
      };

      const result = getResetPasswordURLComponents(link);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle an empty URL string', () => {
      const link = '';
      expect(() => getResetPasswordURLComponents(link)).toThrow();
    });
  });

  describe('handleResetPasswordLink', () => {
    let ref;
    let dispatch;
    const authToken = null;

    beforeEach(() => {
      ref = {
        current: {
          getCurrentRoute: jest.fn(),
          navigate: jest.fn(),
        },
      };
      dispatch = jest.fn();
    });

    it('should dispatch validateResetPasswordLink when in ForgotPassword route', () => {
      StringUtils.isNotEmpty.mockReturnValue(true);
      ref.current.getCurrentRoute.mockReturnValue({name: 'ForgotPassword'});

      const link =
        'https://example.com/resetpassword?accessCode=1234&email=test@example.com&timestamp=2024-08-28T12:34:56';
      const expectedData = {
        emailAddress: 'test@example.com',
        accessCode: '1234',
        timestamp: '2024-08-28T12:34:56',
      };

      handleResetPasswordLink(link, ref, authToken, dispatch);

      // Ensure dispatch was called with the action returned by validateResetPasswordLink
      expect(dispatch).toHaveBeenCalledWith({
        type: 'VALIDATE_RESET_PASSWORD_LINK',
        payload: expectedData,
      });
    });

    it('should navigate to ForgotPassword if not on ForgotPassword route', () => {
      StringUtils.isNotEmpty.mockReturnValue(true);
      ref.current.getCurrentRoute.mockReturnValue({name: 'Home'});

      const link =
        'https://example.com/resetpassword?accessCode=1234&email=test@example.com&timestamp=2024-08-28T12:34:56';
      handleResetPasswordLink(link, ref, authToken, dispatch);

      expect(ref.current.navigate).toHaveBeenCalledWith('ForgotPassword', {
        email: 'test@example.com',
        accessCode: '1234',
        timestamp: '2024-08-28T12:34:56',
      });
    });

    it('should do nothing if dynamicLink is empty', () => {
      StringUtils.isNotEmpty.mockReturnValue(false);

      const link = '';
      handleResetPasswordLink(link, ref, authToken, dispatch);

      expect(ref.current.getCurrentRoute).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
      expect(ref.current.navigate).not.toHaveBeenCalled();
    });
  });
});
