import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {getApiValidationErrorMessage} from '../Login';

export const useLoginError = (isError, errorMessage) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      let message = getApiValidationErrorMessage(errorMessage);
      const loginError = 'Invalid email/password combination.';
      const customeErrorMessage = 'Invalid credentials. Please try again';

      showErrorFlashMessage(
        message === loginError ? customeErrorMessage : message,
      );
      dispatch(clearUserInfo());
    }
  }, [isError, errorMessage, dispatch]);
};
