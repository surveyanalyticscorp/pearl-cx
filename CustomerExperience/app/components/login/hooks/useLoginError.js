import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiValidationErrorMessage} from '../../../Utils/ErrorValidationUtils';

// Constants for better testability
const CLEAR_DELAY_MS = 1000;
const LOGIN_ERROR_TEXT = 'Invalid email/password combination.';
const CUSTOM_ERROR_MESSAGE = 'Invalid credentials. Please try again';

export const useLoginError = (isError, errorMessage, options = {}) => {
  const dispatch = useDispatch();
  const {
    delay = CLEAR_DELAY_MS,
    timeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
  } = options;

  useEffect(() => {
    if (!isError) {
      return;
    }

    // Get the validation message and determine display message
    const message = getApiValidationErrorMessage(errorMessage, 'login');
    const displayMessage =
      message === LOGIN_ERROR_TEXT ? CUSTOM_ERROR_MESSAGE : message;

    // Show the error message
    showErrorFlashMessage(displayMessage);

    // Schedule user data clearing with proper error handling
    const timeoutId = timeoutFn(() => {
      AsyncStorage.clear()
        .then(() => {
          dispatch(clearUserInfo());
        })
        .catch(error => {
          // Even if AsyncStorage fails, still clear user info from Redux
          console.error('AsyncStorage clear failed:', error);
          dispatch(clearUserInfo());
        });
    }, delay);

    // Cleanup function to cancel timeout if component unmounts or dependencies change
    return () => {
      if (timeoutId) {
        clearTimeoutFn(timeoutId);
      }
    };
  }, [isError, errorMessage, dispatch, delay, timeoutFn, clearTimeoutFn]);
};
