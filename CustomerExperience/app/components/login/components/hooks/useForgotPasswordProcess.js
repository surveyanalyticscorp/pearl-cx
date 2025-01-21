import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  isObjectEmpty,
  isStringNullOrEmpty,
  showErrorFlashMessage,
  validateEmail,
} from '../../../../Utils/Utility';
import {translate} from '../../../../Utils/MultilinguaUtils';
import StringUtils from '../../../../Utils/StringUtils';
import {
  authenticatePanel,
  requestPasswordLink,
} from '../../../../redux/actions/login.actions';
import {useEffect} from 'react';
import {validateResetPasswordLink} from '../../../../redux/sagas/loginInSaga';
import {
  setDynamicLink,
  setUserDetailsForResetPassword,
} from '../../../../redux/actions';
import {ASYNC_RESET_CREDENTIALS, BASE_URL} from '../../../../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isValidateInput = ({email, accessCode}) => {
  if (!validateEmail(email)) {
    showErrorFlashMessage(translate('onBoarding.invalidEmail')); // Triggering error message
    return false;
  }
  if (isStringNullOrEmpty(accessCode)) {
    showErrorFlashMessage(translate('onBoarding.invalidCompanyCode')); // Triggering error message
    return false;
  }
  return true;
};

const useForgotPasswordProcess = (route, resetData) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    isLoading,
    isError,
    errorMessage,
    dynamicLink,
    baseUrl,
    validatePasswordLinkResponse,
  } = useSelector(state => state.global);

  const authenticateAccessCode = () => {
    if (isValidateInput(resetData) && StringUtils.isEmpty(baseUrl)) {
      dispatch(authenticatePanel({accessCode: resetData.accessCode}));
    }
  };

  useEffect(() => {
    if (
      route &&
      route.params &&
      route.params.timestamp &&
      StringUtils.isNotEmpty(dynamicLink)
    ) {
      let time = route.params.timestamp.replace('+', ' ');
      if (StringUtils.isNotEmpty(dynamicLink)) {
        let data = {
          emailAddress: resetData.email,
          accessCode: resetData.accessCode,
          timestamp: time,
        };
        // props.validatePasswordLink(data);
        dispatch(validateResetPasswordLink(data));
      }
    }
  }, []);

  useEffect(() => {
    if (!isObjectEmpty(validatePasswordLinkResponse)) {
      if (validatePasswordLinkResponse && validatePasswordLinkResponse.Error) {
        // props.setDynamicLink();
        dispatch(setDynamicLink(''));
        showErrorFlashMessage(validatePasswordLinkResponse.Error);
      } else {
        if (!validatePasswordLinkResponse.isExpired) {
          navigation.navigate('ResetPassword', {
            email: resetData.email,
            accessCode: resetData.accessCode,
          });
        } else {
          // props.setDynamicLink();
          dispatch(setDynamicLink(''));
          showErrorFlashMessage(validatePasswordLinkResponse.message);
        }
      }
    }
  }, [validatePasswordLinkResponse]);

  useEffect(() => {
    if (isError) {
      console.log('ERROR', errorMessage, isError);

      showErrorFlashMessage(
        errorMessage?.errorAlert ??
          errorMessage?.message ??
          'Something went wrong',
      );
    }
  }, [isError]);

  useEffect(() => {
    if (baseUrl && StringUtils.isNotEmpty(baseUrl)) {
      AsyncStorage.setItem(BASE_URL, baseUrl).then();
      global.baseUrl = baseUrl;
      onResetPasswordClick();
    }
  }, [baseUrl]);

  const onResetPasswordClick = () => {
    if (isValidateInput(resetData)) {
      let data = {
        emailAddress: resetData.email,
        accessCode: resetData.accessCode,
      };
      // props.setUserDetails(data);
      dispatch(setUserDetailsForResetPassword(data));

      AsyncStorage.setItem(ASYNC_RESET_CREDENTIALS, JSON.stringify(data));
      // props.requestPasswordLink(data);
      dispatch(requestPasswordLink(data));
    }
  };

  return {authenticateAccessCode};
};

export default useForgotPasswordProcess;
