import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  isStringNullOrEmpty,
  showErrorFlashMessage,
  validateEmail,
} from '../../Utils/Utility';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import {connect, useSelector} from 'react-redux';
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
import SafeAreaView from 'react-native-safe-area-view';
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

let getApiValidationErrorMessage = errorMessage => {
  console.log('getApiValidationErrorMessage', JSON.stringify(errorMessage));
  if (errorMessage.errorAlert) {
    return errorMessage?.errorAlert
      ? errorMessage?.errorAlert
      : errorMessage?.validationErrors[0]?.error;
  }
  return 'Error';
};
const RenderSpinnerLoginButton = ({onPress}) => {
  const isLoading = useSelector(state => state.global.isLoading);
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
  let timer = useRef(null);
  let textFieldTimer = useRef(null);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    accessCode: '',
  });

  const [validation, setValidation] = useState('');

  useEffect(() => {
    return function cleanup() {
      props.clearError();

      clearTimeout(timer);
      clearTimeout(textFieldTimer);
    };
  }, []);

  useEffect(() => {
    console.log('VALIDATION MSG', validation);
    if (StringUtils.isNotEmpty(validation) || props.isError) {
      let message = props.isError
        ? getApiValidationErrorMessage(props.errorMessage)
        : validation;
      const loginError = 'Invalid email/password combination.';
      const customeErrorMessage = 'Invalid credentials. Please try again';
      showErrorFlashMessage(
        message === loginError ? customeErrorMessage : message,
      );
      props.clearUserInfo();
      timer = setTimeout(() => {
        setValidation('');
      }, 1000);
    }
  }, [validation, props.isError]);

  useEffect(() => {
    if (props.baseUrl && StringUtils.isNotEmpty(props.baseUrl)) {
      AsyncStorage.setItem(BASE_URL, props.baseUrl).then();
      AsyncStorage.setItem(SUBSCRIBER_ID, props.subscriberId).then();
      AsyncStorage.setItem(ACCESS_CODE, props.accessCode).then();
      AsyncStorage.setItem(ASYNC_LOGIN_EXPIRE_DATE, getExpireDate());
      global.baseUrl = props.baseUrl;
      global.subscriberId = props.subscriberId;
      console.log('BASEURL', props.baseUrl);
      console.log('SUBSCRIBER_ID', props.subscriberId);

      onSignInPress();
    }
  }, [props.baseUrl]);

  useEffect(() => {
    if (props.clfBaseUrl && StringUtils.isNotEmpty(props.clfBaseUrl)) {
      AsyncStorage.setItem(ASYNC_CLF_BASE_URL, props.clfBaseUrl);

      global.clfBaseUrl = props.clfBaseUrl;

      callClfAuth(props.clfBaseUrl);
    }
  }, [props.clfBaseUrl]);

  function callClfAuth(clfBaseUrl) {
    const data = {
      clfBaseUrl,
      emailAddress: props.userInfo.emailAddress,
      userID: props.userInfo.userID,
      feedbackID: props.userInfo.feedbackID,
      feedbackApiKey: props.userInfo.feedbackApiKey,
    };

    props.getClfAuth(data);
  }

  const onSignInPress = () => {
    Keyboard.dismiss();
    AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then(token => {
      if (isStringNullOrEmpty(token) && isSignInPressed) {
        console.log('onSignInPress: token:', token);
        checkNotificationPermission().then(() => onSignInPress());
      } else {
        console.log('loginAction: called:');

        loginAction(token);
      }
    });
  };

  const authenticateAccessCode = useCallback(() => {
    if (StringUtils.isEmpty(props.baseUrl) && checkValidation()) {
      props.authenticatePanel({accessCode: userData.accessCode});
    }
  }, [userData.accessCode, props.authenticatePanel, props.baseUrl]);

  let loginAction = token => {
    if (checkValidation()) {
      let data = {
        accessCode: userData.accessCode,
        emailAddress: userData.email,
        password: userData.password,
        platform: Platform.OS,
        sourceMode: 'email',
        udId: DeviceInfo.getUniqueId(),
        pushToken: token,
        dataCenter: props.dataCenter,
      };

      // console.log(`LOGIN DATA: ${JSON.stringify(data)}`);
      if (
        StringUtils.isNotEmpty(props.dynamicLink) &&
        props.dynamicLink.includes('resetpassword')
      ) {
        props.resetPasswordLink();
      }
      props.loginClick(data);
    }
  };

  const checkValidation = useCallback(() => {
    // console.log('Validate email: ' + validateEmail(userData.email));
    console.log('VALIDATION MSG', 'checkValidation 1', validation);

    if (!validateEmail(userData.email)) {
      setValidation(translate('onBoarding.invalidEmail'));
      console.log('VALIDATION MSG', 'checkValidation email', validation);

      return false;
    }
    if (isStringNullOrEmpty(userData.password)) {
      setValidation(translate('onBoarding.invalidPassword'));
      console.log('VALIDATION MSG', 'checkValidation password', validation);

      return false;
    }

    if (isStringNullOrEmpty(userData.accessCode)) {
      setValidation(translate('onBoarding.invalidCompanyCode'));
      console.log('VALIDATION MSG', 'checkValidation accessCode', validation);

      return false;
    }
    setValidation('');
    console.log('VALIDATION MSG', 'checkValidation return', validation);

    return true;
  }, [validation, userData.email, userData.password, userData.accessCode]);

  const onForgotPasswordPress = () => {
    props.clearError();
    Keyboard.dismiss();
    props.navigation.navigate('ForgotPassword', {
      email: userData.email,
      accessCode: userData.accessCode,
    });
  };

  const handleEmail = text => {
    if (userData.email !== text) {
      setUserData({
        ...userData,
        email: text,
      });
    }
  };

  const handlePassword = text => {
    if (userData.password !== text) {
      setUserData({
        ...userData,
        password: text,
      });
    }
  };

  const handleAccessCode = text => {
    if (userData.accessCode !== text) {
      setUserData({
        ...userData,
        accessCode: text,
      });
    }
  };

  // const handleSubmit = text => {
  //   authenticateAccessCode();
  // };

  const renderSignTextFieldAndButton = () => {
    return (
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
          <View style={{flex: 1}}>
            <View style={loginStyles.logo}>
              <Image
                style={loginStyles.logoImage}
                resizeMode="contain"
                source={require('../../config/images/cx-logo.png')}
              />
            </View>

            <QPTextField
              secureText={false}
              testID="emailTextField"
              autofocus={false}
              label={translate('onBoarding.email')}
              defaultValue={''}
              style={loginStyles.emailInput}
              onEndEdit={handleEmail}
              onChange={handleEmail}
              onSubmitEditing={() => {
                textFieldTimer = setTimeout(() => {
                  Keyboard.dismiss();
                }, 5);
              }}
            />
            <QPTextField
              testID="passwordTextField"
              secureText={true}
              label={translate('onBoarding.password')}
              defaultValue={''}
              style={loginStyles.emailInput}
              onEndEdit={handlePassword}
              onChange={handlePassword}
              onSubmitEditing={() => {
                textFieldTimer = setTimeout(() => {
                  Keyboard.dismiss();
                }, 5);
              }}
              value={userData.password}
            />
            <QPTextField
              testID="companyCodeTextField"
              defaultValue={''}
              label={translate('onBoarding.companyCode')}
              style={loginStyles.emailInput}
              onChange={handleAccessCode}
              onEndEdit={handleAccessCode}
              onSubmitEditing={() => {
                textFieldTimer = setTimeout(() => {
                  Keyboard.dismiss();
                }, 5);
              }}
              value={userData.accessCode}
              returnKey={'done'}
            />
          </View>
        </KeyboardAvoidingView>
        <RenderSpinnerLoginButton onPress={authenticateAccessCode} />
        <QPButton
          style={loginStyles.forgotPswdButton}
          buttonColor={Colors.fullTransparent}
          onPress={onForgotPasswordPress}
          textStyle={loginStyles.forgotPasswordText}
          buttonText={translate('onBoarding.forgotPassword')}
        />
      </ScrollView>
    );
  };

  return (
    <ImageBackground
      testID="login-container"
      resizeMode={'cover'}
      source={require('../../config/images/background1.png')}
      style={loginStyles.container}>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={loginStyles.safeArea}>
        {renderSignTextFieldAndButton()}
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = state => {
  return {
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    dynamicLink: state.global.dynamicLink,
    dataCenter: state.global.dataCenter,
    baseUrl: state.global.baseUrl,
    clfBaseUrl: state.global.clfBaseUrl,
    subscriberId: state.global.subscriberId,
    userInfo: state.global.userInfo,
    accessCode: state.global.accessCode,
  };
};

const mapDispatchToProps = dispatch => ({
  getClfAuth: param => {
    dispatch(clearError());
    dispatch(getClfAuth(param));
  },
  authenticatePanel: param => {
    dispatch(clearError());
    dispatch(authenticatePanel(param));
  },
  loginClick: data => {
    dispatch(clearError());
    dispatch(doLogin(data));
    dispatch(showLoading(true));
  },
  clearError: () => {
    dispatch(clearError(false));
  },
  resetPasswordLink: () => {
    dispatch(setDynamicLink(''));
  },
  clearUserInfo: () => {
    dispatch(clearUserInfo());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
