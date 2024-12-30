import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {
  isObjectEmpty,
  isStringNullOrEmpty,
  showErrorFlashMessage,
  validateEmail,
} from '../../Utils/Utility';
import {FontFamily} from '../../styles/font.constants';
import QPButton from '../../widgets/Button';
import {
  setDynamicLink,
  setUserDetailsForResetPassword,
} from '../../redux/actions/index';
import {useDispatch, useSelector} from 'react-redux';
import StringUtils from '../../Utils/StringUtils';
import QPSpinner from '../../widgets/QPSpinner';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_RESET_CREDENTIALS, BASE_URL} from '../../api/Constant';
import {
  authenticatePanel,
  requestPasswordLink,
  validateResetPasswordLink,
} from '../../redux/actions/login.actions';

let {width} = Dimensions.get('window');
import {translate} from '../../Utils/MultilinguaUtils';
import AccessCodeTextInput from './components/AccessCodeTextInput';
import EmailTextInput from './components/EmailTextInput';
import CXLogo from './components/CXLogo';
import LoginBackground from './components/LoginBackground';
import {useNavigation} from '@react-navigation/core';

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

let RenderSpinnerResetButton = ({route}) => {
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
  const login = useSelector(state => state.login);

  const authenticateAccessCode = () => {
    if (isValidateInput(login) && StringUtils.isEmpty(baseUrl)) {
      dispatch(authenticatePanel({accessCode: login.accessCode}));
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
          emailAddress: login.email,
          accessCode: login.accessCode,
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
            email: login.email,
            accessCode: login.accessCode,
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
    if (isValidateInput(login)) {
      let data = {
        emailAddress: login.email,
        accessCode: login.accessCode,
      };
      // props.setUserDetails(data);
      dispatch(setUserDetailsForResetPassword(data));

      AsyncStorage.setItem(ASYNC_RESET_CREDENTIALS, JSON.stringify(data));
      // props.requestPasswordLink(data);
      dispatch(requestPasswordLink(data));
    }
  };

  return isLoading ? (
    <View style={styles.resetPswdButton}>
      <QPSpinner testID="loading-indicator" spinnerColor={Colors.white} />
    </View>
  ) : (
    <QPButton
      testID="SignInButton"
      style={styles.resetPswdButton}
      onPress={authenticateAccessCode}
      buttonText={translate('onBoarding.resetPassword')}
      textStyle={styles.nextText}
    />
  );
};

const ForgotPassword = props => {
  console.log('NAVIGATION_LOGIN', props.route.name);

  return (
    <LoginBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}>
        <KeyboardAvoidingView
          behavior="position"
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: Platform.isPad ? -200 : -150,
            android: -200,
          })}
          enabled>
          <CXLogo />
          <View style={styles.textFieldContainer}>
            <Text style={styles.forgotPasswordMessage}>
              {translate('onBoarding.forgotPasswordMessage')}
            </Text>
            <EmailTextInput />
            <AccessCodeTextInput />
          </View>
        </KeyboardAvoidingView>
        <RenderSpinnerResetButton />
      </ScrollView>
    </LoginBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: PaddingConstants.tab2,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoImage: {
    width: width * 0.75,
    height: width * 0.45,
  },
  logo: {
    alignItems: 'center',
  },
  textFieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: width / 1.05,
    height: MarginConstants.tab4,
    marginBottom: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab1,
  },
  resetPswdButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab1,
  },
  nextText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  forgotPasswordMessage: {
    fontSize: TextSizes.secondary,
    textAlign: 'center',
    fontFamily: FontFamily.light,
    color: Colors.primary,
    alignSelf: 'center',
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab2,
  },
});
