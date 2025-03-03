// import {renderHook} from '@testing-library/react-hooks'; // Add this import
// import {showMessage} from 'react-native-flash-message';
// import {Colors} from '../styles/color.constants';
// import {EMAIL_PATTERN} from '../api/Constant';
// import {
//   isStringNullOrEmpty,
//   validateEmail,
//   isObjectEmpty,
//   usePrevious,
//   showErrorFlashMessage,
//   showSuccessFlashMessage,
//   showSuccesfullyCopiedFlashMessage,
// } from './Utility';

// jest.mock('react-native-flash-message', () => ({
//   showMessage: jest.fn(),
// }));

// describe('Utility functions', () => {
//   describe('isStringNullOrEmpty', () => {
//     it('should return true for null or empty strings', () => {
//       expect(isStringNullOrEmpty(null)).toBe(true);
//       expect(isStringNullOrEmpty('')).toBe(true);
//       expect(isStringNullOrEmpty('   ')).toBe(true);
//     });

//     it('should return false for non-empty strings', () => {
//       expect(isStringNullOrEmpty('string')).toBe(false);
//     });
//   });

//   describe('validateEmail', () => {
//     it('should return true for valid email addresses', () => {
//       expect(validateEmail('test@example.com')).toBe(true);
//       expect(validateEmail('user.name+tag+sorting@example.com')).toBe(true);
//     });

//     it('should return false for invalid email addresses', () => {
//       expect(validateEmail('plainaddress')).toBe(false);
//       expect(validateEmail('@missingusername.com')).toBe(false);
//       expect(validateEmail('username@.com')).toBe(false);
//     });
//   });

//   describe('isObjectEmpty', () => {
//     it('should return true for empty objects', () => {
//       expect(isObjectEmpty({})).toBe(true);
//     });

//     it('should return false for non-empty objects', () => {
//       expect(isObjectEmpty({key: 'value'})).toBe(false);
//     });
//   });

//   describe('usePrevious', () => {
//     it('should return the previous value', () => {
//       const {result, rerender} = renderHook(({value}) => usePrevious(value), {
//         initialProps: {value: 1},
//       });

//       expect(result.current).toBeUndefined();

//       rerender({value: 2});
//       expect(result.current).toBe(1);
//     });
//   });

//   describe('showErrorFlashMessage', () => {
//     it('should call showMessage with the correct parameters', () => {
//       const error = 'An error occurred';
//       showErrorFlashMessage(error);
//       expect(showMessage).toHaveBeenCalledWith({
//         message: error,
//         type: 'danger',
//         backgroundColor: Colors.overdueBackgroundColor,
//         color: Colors.deleteButtonText,
//       });
//     });

//     it('should use default message if error is not provided', () => {
//       showErrorFlashMessage();
//       expect(showMessage).toHaveBeenCalledWith({
//         message: 'something went worng, please try again later.',
//         type: 'danger',
//         backgroundColor: Colors.overdueBackgroundColor,
//         color: Colors.deleteButtonText,
//       });
//     });
//   });

//   describe('showSuccessFlashMessage', () => {
//     it('should call showMessage with the correct parameters', () => {
//       const message = 'Success!';
//       showSuccessFlashMessage(message);
//       expect(showMessage).toHaveBeenCalledWith({
//         message: message,
//         type: 'success',
//         backgroundColor: Colors.success,
//         color: Colors.white,
//       });
//     });
//   });

//   describe('showSuccesfullyCopiedFlashMessage', () => {
//     it('should call showMessage with the correct parameters', () => {
//       const message = 'Copied!';
//       const textColor = Colors.white;
//       const backgroundColor = Colors.success;

//       showSuccesfullyCopiedFlashMessage(message, textColor, backgroundColor);
//       expect(showMessage).toHaveBeenCalledWith({
//         message: message,
//         type: 'success',
//         backgroundColor: backgroundColor,
//         color: textColor,
//       });
//     });
//   });
// });
import {renderHook} from '@testing-library/react-hooks';
import {showMessage} from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import {Colors} from '../styles/color.constants';
import {
  isStringNullOrEmpty,
  validateEmail,
  isObjectEmpty,
  usePrevious,
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from './Utility';

jest.mock('react-native-flash-message', () => ({
  showMessage: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

describe('Utility functions', () => {
  describe('isStringNullOrEmpty', () => {
    it('should return true for null or empty strings', () => {
      expect(isStringNullOrEmpty(null)).toBe(true);
      expect(isStringNullOrEmpty('')).toBe(true);
      expect(isStringNullOrEmpty('   ')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isStringNullOrEmpty('string')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag+sorting@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missingusername.com')).toBe(false);
      expect(validateEmail('username@.com')).toBe(false);
    });
  });

  describe('isObjectEmpty', () => {
    it('should return true for empty objects', () => {
      expect(isObjectEmpty({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isObjectEmpty({key: 'value'})).toBe(false);
    });
  });

  describe('usePrevious', () => {
    it('should return the previous value', () => {
      const {result, rerender} = renderHook(({value}) => usePrevious(value), {
        initialProps: {value: 1},
      });

      expect(result.current).toBeUndefined();

      rerender({value: 2});
      expect(result.current).toBe(1);
    });
  });

  describe('showErrorFlashMessage', () => {
    it('should call Toast.show with the correct parameters', () => {
      const error = 'An error occurred';
      showErrorFlashMessage(error);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'custom_error',
        props: {
          headerText: 'Error',
          bodyText: error,
          leadingIcon: expect.objectContaining({
            name: 'alert-circle-outline',
          }),
          trailingIcon: expect.objectContaining({
            onPress: expect.any(Function),
          }),
        },
      });
    });

    it('should use default message if error is not provided', () => {
      showErrorFlashMessage();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'custom_error',
        props: {
          headerText: 'Error',
          bodyText: 'something went worng, please try again later.',
          leadingIcon: expect.objectContaining({
            name: 'alert-circle-outline',
          }),
          trailingIcon: expect.objectContaining({
            onPress: expect.any(Function),
          }),
        },
      });
    });

    it('should call Toast.hide when close icon is pressed in error toast', () => {
      showErrorFlashMessage();
      const {onPress} = Toast.show.mock.calls[0][0].props.trailingIcon;
      onPress();
      expect(Toast.hide).toHaveBeenCalled();
    });
  });

  describe('showSuccessFlashMessage', () => {
    it('should call Toast.show with the correct parameters', () => {
      const message = 'Success!';
      showSuccessFlashMessage(message);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'custom_success',
        props: {
          headerText: 'Success',
          bodyText: message,
          leadingIcon: expect.objectContaining({
            name: 'checkmark-sharp',
          }),
          trailingIcon: expect.objectContaining({
            onPress: expect.any(Function),
          }),
        },
      });
    });

    it('should call Toast.hide when close icon is pressed in success toast', () => {
      showSuccessFlashMessage();
      const {onPress} = Toast.show.mock.calls[0][0].props.trailingIcon;
      onPress();
      expect(Toast.hide).toHaveBeenCalled();
    });
  });
});
