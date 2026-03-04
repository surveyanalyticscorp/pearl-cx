import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {FontFamily} from '../../styles/font.constants';
import {Colors} from '../../styles/color.constants';
import QPButton from '../../widgets/Button';
import React, {useEffect, useRef, useState} from 'react';
import {clearError} from '../../redux/actions/index';
import {updatePassword} from '../../redux/actions/login.actions';
import {connect} from 'react-redux';
import {
  isStringNullOrEmpty,
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';
import StringUtils from '../../Utils/StringUtils';
import {PaddingConstants} from '../../styles/padding.constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import QPSpinner from '../../widgets/QPSpinner';
import {TextSizes} from '../../styles/textsize.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_RESET_CREDENTIALS} from '../../api/Constant';
import {setDynamicLink} from '../../redux/actions';
import QPTextField from '../../widgets/TextField';
import {translate} from '../../Utils/MultilinguaUtils';

let {width} = Dimensions.get('window');

const ResetPassword = props => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validation, setValidation] = useState('');
  let textFieldTimer = useRef(null);

  console.log('NAVIGATION_LOGIN', props.route.name);

  useEffect(() => {
    if (props.updatePasswordResponse.body) {
      showSuccessFlashMessage(props.updatePasswordResponse.body.message);
      props.setDynamicLink();
      props.navigation.navigate('Login');
    }
  }, [props.updatePasswordResponse]);

  useEffect(() => {
    if (StringUtils.isNotEmpty(validation) || props.isError) {
      let message = props.isError ? props.errorMessage.errorAlert : validation;
      showErrorFlashMessage(message);
      let timer = setTimeout(() => {
        setValidation('');
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [validation, props.isError]);

  const onUpdatePasswordClick = () => {
    if (isValidateInput()) {
      let data = {
        emailAddress: props.route.params.email,
        accessCode: props.route.params.accessCode,
        password: password,
      };
      AsyncStorage.setItem(ASYNC_RESET_CREDENTIALS, '');
      props.updatePassword(data);
    }
  };

  const isValidateInput = () => {
    if (isStringNullOrEmpty(password)) {
      console.log('RESET PASSWORD 1', 'CONFIRM PASSWORD NOT VALID');

      setValidation(translate('onBoarding.invalidPassword'));
      return false;
    }
    if (isStringNullOrEmpty(confirmPassword)) {
      console.log('RESET PASSWORD 2', 'CONFIRM PASSWORD NOT VALID');

      setValidation(translate('onBoarding.invalidPassword'));
      return false;
    }
    if (password !== confirmPassword) {
      setValidation(translate('onBoarding.passwordNotMatching'));
      return false;
    }
    setValidation('');
    return true;
  };

  const handlePassword = text => {
    setPassword(text);
    setValidation('');
  };

  const handleConfirmPassword = text => {
    setConfirmPassword(text);
    setValidation('');
  };

  let renderSpinnerResetButton = () => {
    return props.isLoading ? (
      <View style={styles.nextButton}>
        <QPSpinner spinnerColor={Colors.white} />
      </View>
    ) : (
      <QPButton
        testID="SignInButton"
        style={styles.nextButton}
        onPress={onUpdatePasswordClick}
        buttonText={'Update Password'}
        textStyle={styles.nextText}
      />
    );
  };

  let renderContainer = () => {
    return (
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
          <View style={styles.logo}>
            <Image
              style={styles.logoImage}
              resizeMode="contain"
              source={require('../../config/images/cx-logo.png')}
            />
          </View>
          <View style={styles.textFieldContainer}>
            <Text style={styles.resetPasswordMessage}>
              {translate('onBoarding.resetPasswordMessage')}
            </Text>
            <QPTextField
              testID="password-input"
              label="Password"
              autofocus={false}
              label={'Password'}
              value={password}
              secureText={true}
              defaultValue={''}
              style={styles.textInput}
              onEndEdit={handlePassword}
              onChange={handlePassword}
              onSubmitEditing={() => {
                textFieldTimer = setTimeout(() => {
                  Keyboard.dismiss();
                }, 5);
              }}
            />
            <QPTextField
              testID="confirm-password-input"
              label="Confirm Password"
              defaultValue={''}
              value={confirmPassword}
              secureText={true}
              label={'Confirm Password'}
              style={styles.textInput}
              onEndEdit={handleConfirmPassword}
              onChange={handleConfirmPassword}
              onSubmitEditing={() => {
                textFieldTimer = setTimeout(() => {
                  Keyboard.dismiss();
                }, 5);
              }}
            />
          </View>
        </KeyboardAvoidingView>
        {renderSpinnerResetButton()}
      </ScrollView>
    );
  };

  return (
    <ImageBackground
      resizeMode={'cover'}
      source={require('../../config/images/background1.png')}
      style={styles.container}>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={styles.safeArea}>
        {renderContainer()}
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = state => {
  return {
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    updatePasswordResponse: state.global.updatePasswordResponse,
  };
};
const mapDispatchToProps = dispatch => ({
  clearError: () => {
    dispatch(clearError(false));
  },
  updatePassword: data => {
    dispatch(updatePassword(data));
  },
  setDynamicLink: () => {
    dispatch(setDynamicLink(''));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  nextButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab3,
    marginHorizontal: MarginConstants.tab1,
  },
  nextText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  resetPasswordMessage: {
    fontSize: TextSizes.secondary,
    textAlign: 'center',
    fontFamily: FontFamily.light,
    color: Colors.primary,
    alignSelf: 'center',
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab2,
  },
});
