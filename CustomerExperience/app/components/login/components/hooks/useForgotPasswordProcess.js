import {useDispatch, useSelector} from 'react-redux';
import {
  isStringNullOrEmpty,
  showErrorFlashMessage,
  showSuccessFlashMessage,
  validateEmail,
} from '../../../../Utils/Utility';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {
  clearResetPasswordLinkResponse,
  requestPasswordLink,
} from '../../../../redux/actions/login.actions';
import {useEffect} from 'react';
import {setUserDetailsForResetPassword} from '../../../../redux/actions';
import {ASYNC_RESET_CREDENTIALS} from '../../../../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

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
  const navigation = useNavigation();

  const {isError, errorMessage, resetPasswordLinkResponse} = useSelector(
    state => state.global,
  );

  useEffect(() => {
    console.log(
      'useForgotPasswordProcess',
      isError,
      errorMessage,
      resetPasswordLinkResponse,
    );
    if (isError && errorMessage?.message) {
      showErrorFlashMessage(errorMessage.message);
    }
    if (resetPasswordLinkResponse && resetPasswordLinkResponse?.message) {
      showSuccessFlashMessage('Reset password link sent to your email');
      dispatch(clearResetPasswordLinkResponse());
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [isError, errorMessage, resetPasswordLinkResponse]);
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
