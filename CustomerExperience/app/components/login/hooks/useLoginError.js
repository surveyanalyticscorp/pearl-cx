import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiValidationErrorMessage} from '../../../Utils/ErrorValidationUtils';

export const useLoginError = (isError, errorMessage) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      let message = getApiValidationErrorMessage(errorMessage, 'login');
      const loginError = 'Invalid email/password combination.';
      const customeErrorMessage = 'Invalid credentials. Please try again';

      showErrorFlashMessage(
        message === loginError ? customeErrorMessage : message,
      );
      AsyncStorage.clear().then(() => {
        dispatch(clearUserInfo());
      });
    }
  }, [isError, errorMessage, dispatch]);
};
