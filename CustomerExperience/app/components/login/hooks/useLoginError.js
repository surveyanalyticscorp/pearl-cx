import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiValidationErrorMessage} from '../../../Utils/ErrorValidationUtils';

export const useLoginError = (isError, errorMessage) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('LOGIN ERROR', isError, errorMessage);
    if (isError) {
      let message = getApiValidationErrorMessage(errorMessage, 'login');
      const loginError = 'Invalid email/password combination.';
      const customeErrorMessage = 'Invalid credentials. Please try again';

      showErrorFlashMessage(
        message === loginError ? customeErrorMessage : message,
      );
      console.log('LOGIN ERROR', JSON.stringify(errorMessage));
      setTimeout(() => {
        AsyncStorage.clear().then(() => {
          dispatch(clearUserInfo());
        });
      }, 1000);
    }
  }, [isError, errorMessage, dispatch]);
};
