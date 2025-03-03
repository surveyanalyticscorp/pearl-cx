import {validateForgotPasswordData} from './useForgotPasswordProcess';
import {translate} from '../../../../Utils/MultilinguaUtils';

jest.mock('../../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key), // Simplistic mock
}));

describe('validateForgotPasswordData', () => {
  it('returns null if email and accessCode are valid', () => {
    const result = validateForgotPasswordData({
      email: 'test@example.com',
      accessCode: '1234',
    });
    expect(result).toBeNull();
  });

  it('returns invalid email message if email is invalid', () => {
    const result = validateForgotPasswordData({
      email: 'invalid-email',
      accessCode: '1234',
    });
    expect(result).toBe('onBoarding.invalidEmail');
  });

  it('returns invalid access code message if access code is empty', () => {
    const result = validateForgotPasswordData({
      email: 'test@example.com',
      accessCode: '',
    });
    expect(result).toBe('onBoarding.invalidCompanyCode');
  });
});
