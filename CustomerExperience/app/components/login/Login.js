import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  isStringNullOrEmpty,
  showErrorFlashMessage,
  validateEmail,
} from '../../Utils/Utility';
import QPButton from '../../widgets/Button';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearError,
  clearUserInfo,
  showLoading,
} from '../../redux/actions/index';
import {
  authenticatePanel,
  doLogin,
  getClfAuth,
} from '../../redux/actions/login.actions';
import {loginStyles} from './login.styles';
import StringUtils from '../../Utils/StringUtils';
import {Colors} from '../../styles/color.constants';
import QPSpinner from '../../widgets/QPSpinner';
import {setDynamicLink} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ACCESS_CODE,
  ASYNC_CLF_BASE_URL,
  ASYNC_LOGIN_EXPIRE_DATE,
  ASYNC_PUSH_TOKEN,
  BASE_URL,
  SUBSCRIBER_ID,
} from '../../api/Constant';
import {checkNotificationPermission} from '../../Utils/NotificationUtils';
import {getExpireDate} from '../../Utils/TimeUtils';
import {translate} from '../../Utils/MultilinguaUtils';

import {useNavigation} from '@react-navigation/core';
import EmailTextInput from './components/EmailTextInput';
import PasswordTextInput from './components/PasswordTextInput';
import AccessCodeTextInput from './components/AccessCodeTextInput';
import CXLogo from './components/CXLogo';
import LoginBackground from './components/LoginBackground';

let getApiValidationErrorMessage = errorMessage => {
  console.log('getApiValidationErrorMessage', JSON.stringify(errorMessage));
  if (errorMessage.errorAlert) {
    return errorMessage?.errorAlert
      ? errorMessage?.errorAlert
      : errorMessage?.validationErrors[0]?.error;
  }
  return 'Error';
};

const checkValidation = ({email, password, accessCode}) => {
  if (!validateEmail(email)) {
    console.log('EMAIL NOT VALID');
    showErrorFlashMessage(translate('onBoarding.invalidEmail'));

    return false;
  }
  if (isStringNullOrEmpty(password)) {
    console.log('LOGIN', 'PASSWORD NOT VALID');

    showErrorFlashMessage(translate('onBoarding.invalidPassword'));

    return false;
  }

  if (isStringNullOrEmpty(accessCode)) {
    showErrorFlashMessage(translate('onBoarding.invalidCompanyCode'));

    return false;
  }

  return true;
};

const RenderForgotPasswordButton = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onPress = () => {
    dispatch(clearError(false));
    Keyboard.dismiss();
    navigation.navigate('ForgotPassword');
  };
  return (
    <QPButton
      style={loginStyles.forgotPswdButton}
      buttonColor={Colors.fullTransparent}
      onPress={onPress}
      textStyle={loginStyles.forgotPasswordText}
      buttonText={translate('onBoarding.forgotPassword')}
    />
  );
};

const RenderSpinnerLoginButton = ({login}) => {
  // const [login, setLogin] = useState({});

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.global.isLoading);
  // const login = useSelector(state => state.login);

  const {
    isError,
    errorMessage,
    dataCenter,
    dynamicLink,
    baseUrl,
    clfBaseUrl,
    subscriberId,
    userInfo,
  } = useSelector(state => state.global);

  const globalAccessCode = useSelector(state => state.global.accessCode);

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
  }, [isError]);

  useEffect(() => {
    if (baseUrl && StringUtils.isNotEmpty(baseUrl)) {
      AsyncStorage.setItem(BASE_URL, baseUrl).then();
      AsyncStorage.setItem(SUBSCRIBER_ID, subscriberId).then();
      AsyncStorage.setItem(ACCESS_CODE, globalAccessCode).then();
      AsyncStorage.setItem(ASYNC_LOGIN_EXPIRE_DATE, getExpireDate());
      global.baseUrl = baseUrl;
      global.subscriberId = subscriberId;
      console.log('BASEURL', baseUrl);
      console.log('SUBSCRIBER_ID', subscriberId);
      onSignInPress();
    }
  }, [baseUrl]);

  useEffect(() => {
    if (clfBaseUrl && StringUtils.isNotEmpty(clfBaseUrl)) {
      AsyncStorage.setItem(ASYNC_CLF_BASE_URL, clfBaseUrl);
      global.clfBaseUrl = clfBaseUrl;
      callClfAuth(clfBaseUrl);
    }
  }, [clfBaseUrl]);

  function callClfAuth() {
    const data = {
      clfBaseUrl,
      emailAddress: userInfo.emailAddress,
      userID: userInfo.userID,
      feedbackID: userInfo.feedbackID,
      feedbackApiKey: userInfo.feedbackApiKey,
    };
    dispatch(clearError());
    dispatch(getClfAuth(data));
  }

  const onSignInPress = () => {
    Keyboard.dismiss();
    AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then(token => {
      if (isStringNullOrEmpty(token)) {
        console.log('onSignInPress: token:', token);
        checkNotificationPermission().then(() => onSignInPress());
      } else {
        console.log('loginAction: called:');

        loginAction(token);
      }
    });
  };

  let loginAction = token => {
    if (checkValidation(login)) {
      let data = {
        accessCode: login.accessCode,
        emailAddress: login.email,
        password: login.password,
        platform: Platform.OS,
        sourceMode: 'email',
        udId: DeviceInfo.getUniqueId(),
        pushToken: token,
        dataCenter: dataCenter,
      };

      if (
        StringUtils.isNotEmpty(dynamicLink) &&
        dynamicLink.includes('resetpassword')
      ) {
        // resetPasswordLink
        dispatch(setDynamicLink(''));
      }
      // props.loginClick(data);
      dispatch(clearError());
      dispatch(doLogin(data));
      dispatch(showLoading(true));
    }
  };

  const onPress = () => {
    if (StringUtils.isEmpty(baseUrl) && checkValidation(login)) {
      dispatch(authenticatePanel({accessCode: login?.accessCode ?? ''}));
    }
  };
  return isLoading ? (
    <View style={loginStyles.signInButton}>
      <QPSpinner spinnerColor={Colors.white} />
    </View>
  ) : (
    <QPButton
      testID="SignInButton"
      style={loginStyles.signInButton}
      buttonColor={Colors.accentLight}
      onPress={onPress}
      buttonText={translate('onBoarding.signIn')}
      textStyle={loginStyles.signInText}
    />
  );
};

const Login = props => {
  console.log('LOGIN RENDERED');
  const [login, setLogin] = useState({email: '', password: '', accessCode: ''});
  const setEmail = email => {
    setLogin({...login, email});
  };
  const setPassword = password => {
    setLogin({...login, password});
  };
  const setAccessCode = accessCode => {
    setLogin({...login, accessCode});
  };
  return (
    <LoginBackground>
      <ScrollView
        contentContainerStyle={loginStyles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}>
        <KeyboardAvoidingView
          behavior="position"
          style={loginStyles.container}
          keyboardVerticalOffset={Platform.select({
            ios: Platform.isPad ? -200 : -100,
            android: -200,
          })}
          enabled>
          <CXLogo />
          <EmailTextInput value={login.email} setEmail={setEmail} />
          <PasswordTextInput value={login.password} setPassword={setPassword} />
          <AccessCodeTextInput
            value={login.accessCode}
            setAccessCode={setAccessCode}
          />
        </KeyboardAvoidingView>
        <RenderSpinnerLoginButton login={login} />
        <RenderForgotPasswordButton />
      </ScrollView>
    </LoginBackground>
  );
};

export default Login;
