import {useDispatch, useSelector} from 'react-redux';
import {
  isStringNullOrEmpty,
  showErrorFlashMessage,
  validateEmail,
} from '../../../../Utils/Utility';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {requestPasswordLink} from '../../../../redux/actions/login.actions';
import {useEffect} from 'react';
import {setUserDetailsForResetPassword} from '../../../../redux/actions';
import {ASYNC_RESET_CREDENTIALS} from '../../../../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isValidInput = ({email, accessCode}) => {
  const error = validateForgotPasswordData({email, accessCode});
  if (error) {
    showErrorFlashMessage(error);
    console.log('LOG: isValidInput', error);
    return false;
  }
  console.log('LOG: isValidInput', error);

  return true;
};

export const validateForgotPasswordData = ({email, accessCode}) => {
  if (!validateEmail(email)) {
    return translate('onBoarding.invalidEmail');
  }
  if (isStringNullOrEmpty(accessCode)) {
    return translate('onBoarding.invalidCompanyCode');
  }
  return null; // Means no error
};
export const getFormatedEmailAndAccessCode = resetData => {
  return {
    emailAddress: resetData.email,
    accessCode: resetData.accessCode,
  };
};
const useForgotPasswordProcess = resetData => {
  const dispatch = useDispatch();
  const {isError, errorMessage} = useSelector(state => state.global);

  useEffect(() => {
    if (isError) {
      console.log('ERROR', errorMessage, isError);

      showErrorFlashMessage(
        errorMessage?.errorAlert ??
          errorMessage?.message ??
          'Something went wrong',
      );
    }
  }, [isError, errorMessage]);
  const onResetPasswordClick = () => {
    console.log('LOG: onResetPasswordClick', resetData);
    if (isValidInput(resetData)) {
      const data = getFormatedEmailAndAccessCode(resetData);
      dispatch(setUserDetailsForResetPassword(data));
      AsyncStorage.setItem(ASYNC_RESET_CREDENTIALS, JSON.stringify(data));
      dispatch(requestPasswordLink(data));
    }
  };
  return {onResetPasswordClick};
};
export default useForgotPasswordProcess;
