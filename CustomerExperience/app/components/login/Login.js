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
  getDeviceType,
  isObjectEmpty,
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
import {useLoginError} from './hooks/useLoginError';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {getApiValidationErrorMessage} from '../../Utils/ErrorValidationUtils';
import useLoginPersistence from '../../routes/drawerContent/useLoginPersistance';
import {keysToRemove} from '../../routes/drawerContent/useLogoutProcess';

export const checkValidation = ({email, password, accessCode}) => {
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

export const RenderForgotPasswordButton = () => {
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
export const setGlobalData = (baseUrl, clfBaseUrl, subscriberId) => {
  global.baseUrl = baseUrl;
  global.subscriberId = subscriberId;
  global.clfBaseUrl = clfBaseUrl;
  console.log('BASEURL', baseUrl);
  console.log('CLF BASE URL', clfBaseUrl);
  console.log('SUBSCRIBER_ID', subscriberId);
};

export const setAsyncStorageData = (
  baseUrl,
  subscriberId,
  globalAccessCode,
  clfBaseUrl,
) => {
  AsyncStorage.setItem(BASE_URL, baseUrl).then();
  AsyncStorage.setItem(SUBSCRIBER_ID, subscriberId).then();
  AsyncStorage.setItem(ACCESS_CODE, globalAccessCode).then();
  AsyncStorage.setItem(ASYNC_LOGIN_EXPIRE_DATE, getExpireDate());
  AsyncStorage.setItem(ASYNC_CLF_BASE_URL, clfBaseUrl);
};

export const RenderSpinnerLoginButton = ({login}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.global.isLoading);
  const {
    isError,
    errorMessage,
    dataCenter,
    dynamicLink,
    baseUrl,
    clfBaseUrl,
    subscriberId,
    userInfo,
    bearerToken,
    authToken,
  } = useSelector(state => state.global);

  const globalAccessCode = useSelector(state => state.global.accessCode);

  // useLoginError(isError, errorMessage);

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
        AsyncStorage.multiRemove(keysToRemove).then(() => {
          dispatch(clearUserInfo());
        });
      }, 1000);
    }
  }, [isError, errorMessage]);

  useEffect(() => {
    if (
      baseUrl &&
      StringUtils.isNotEmpty(
        baseUrl && subscriberId && StringUtils.isNotEmpty(subscriberId),
      )
    ) {
      setGlobalData(baseUrl, subscriberId);
      handleSignInWithPushToken();
    }
  }, [baseUrl]);

  useEffect(() => {
    if (clfBaseUrl && StringUtils.isNotEmpty(clfBaseUrl)) {
      console.log('USER_INFO', 'LOGIN');

      global.clfBaseUrl = clfBaseUrl;
      setAsyncStorageData(baseUrl, subscriberId, globalAccessCode, clfBaseUrl);
      callClfAuth(clfBaseUrl);
    }
  }, [clfBaseUrl]);

  const callClfAuth = () => {
    AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then(token => {
      const data = {
        clfBaseUrl,
        emailAddress: userInfo.emailAddress,
        userID: userInfo.userID,
        feedbackID: userInfo.feedbackID,
        feedbackApiKey: userInfo.feedbackApiKey,
        pushToken: token,
        deviceType: getDeviceType(Platform.OS),
      };
      console.log('CLF AUTH DATA', JSON.stringify(data));
      dispatch(clearError());
      dispatch(getClfAuth(data));
    });
  };

  // Add a ref to track retries
  const [pushTokenRetryCount, setPushTokenRetryCount] = useState(0);

  const handleSignInWithPushToken = async () => {
    // Check if running on simulator/emulator
    const isEmulator = await DeviceInfo.isEmulator();
    if (isEmulator) {
      console.log('Running on simulator/emulator, skipping push token logic.');
      // Use a dummy token for simulator
      loginAction('SIMULATOR_DUMMY_TOKEN');
      return;
    }

    AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then(token => {
      if (isStringNullOrEmpty(token)) {
        console.log('handleSignInWithPushToken: token:', token);
        if (pushTokenRetryCount < 3) {
          setPushTokenRetryCount(pushTokenRetryCount + 1);
          // Add delay between retries to prevent rapid loops
          setTimeout(() => {
            checkNotificationPermission().then(() => {
              // Add another timeout before retry to allow token generation
              setTimeout(() => handleSignInWithPushToken(), 2000);
            });
          }, 1000);
        } else {
          console.log('Max retries reached, proceeding with dummy token');
          // Use dummy token after max retries to allow login to proceed
          loginAction('PUSH_TOKEN_RETRY_EXCEEDED');
        }
      } else if (token.startsWith('FCM_') && token.includes('ERROR')) {
        // Handle error tokens - proceed with login but log the error
        console.log(
          'FCM token error detected, proceeding with error token:',
          token,
        );
        loginAction(token);
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
    if (checkValidation(login)) {
      Keyboard.dismiss();
      dispatch(authenticatePanel({accessCode: login?.accessCode ?? ''}));
    }
  };
  return isLoading ? (
    <View
      style={{
        ...loginStyles.signInButton,
        marginHorizontal: MarginConstants.tab1_2x,
      }}>
      <QPSpinner spinnerColor={Colors.white} />
    </View>
  ) : (
    <View style={{paddingHorizontal: PaddingConstants.tab1_2x}}>
      <QPButton
        testID="SignInButton"
        style={loginStyles.signInButton}
        buttonColor={Colors.accentLight}
        onPress={onPress}
        buttonText={translate('onBoarding.signIn')}
        textStyle={loginStyles.signInText}
      />
    </View>
  );
};

const Login = props => {
  const {email, accessCode} = useLoginPersistence();

  const [login, setLogin] = useState({
    email: '',
    password: '',
    accessCode: '',
  });

  // Update local state when persistence hook loads values
  useEffect(() => {
    if (email) {
      setLogin(prevLogin => ({...prevLogin, email: email}));
    }
    if (accessCode) {
      setLogin(prevLogin => ({...prevLogin, accessCode: accessCode}));
    }
  }, [email, accessCode]);
  const setEmail = email_ => {
    setLogin(prevLogin => ({...prevLogin, email: email_}));
  };
  const setPassword = password_ => {
    setLogin(prevLogin => ({...prevLogin, password: password_}));
  };
  const setAccessCode = accessCode_ => {
    setLogin(prevLogin => ({...prevLogin, accessCode: accessCode_}));
  };
  return (
    <LoginBackground>
      <ScrollView
        contentContainerStyle={loginStyles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}>
        <View style={loginStyles.logoContainer}>
          <CXLogo />
        </View>
        <KeyboardAvoidingView
          behavior="position"
          style={loginStyles.container}
          keyboardVerticalOffset={Platform.select({
            ios: Platform.isPad ? -200 : -100,
            android: -200,
          })}
          enabled>
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
