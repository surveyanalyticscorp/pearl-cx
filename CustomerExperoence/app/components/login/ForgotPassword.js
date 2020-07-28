/* eslint-disable */
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {MarginConstants} from '../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {isStringNullOrEmpty, validateEmail} from '../Utils/Utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fontFamily} from '../styles/font.constants';
import QPTextField from '../widgets/TextField';
import QPButton from '../widgets/Button';
import {clearError, requestOtp, showLoading, validateUserOtp} from '../redux/actions';
import {connect} from 'react-redux';
import {loginStyles} from './login.styles';
import StringUtils from '../Utils/StringUtils';
import BarIndicator from 'react-native-indicators/src/components/bar-indicator';
const screen = Dimensions.get('screen');
import {showMessage} from 'react-native-flash-message';
import DialogContainer from '../widgets/dialog/Container';
import DialogTitle from '../widgets/dialog/Title';
import DialogInput from '../widgets/dialog/Input';
import DialogButton from '../widgets/dialog/Button';

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [validation, setValidation] = useState('');
  const [otp, setOtp] = useState('');
  const [otpAlert, setOtpAlert] = useState(false);

  useEffect(() => {
    if (props.forgotPasswordResponse.body) {
      showMessage({
        message: props.forgotPasswordResponse.body.message,
        type: 'info',
        icon: 'auto',
      });
      setOtpAlert(true);
    }
  }, [props.forgotPasswordResponse]);

  useEffect(() => {
    if (props.validateOtpResponse.body) {
      if (props.validateOtpResponse.body.success) {
        props.clearError();
        setOtpAlert(false);
        props.navigation.replace('ResetPassword', {
          email: email,
          accessCode: accessCode,
        });
      }
    }
  }, [props.validateOtpResponse]);

  const onResetPasswordClick = () => {
    if (isValidateInput()) {
      let data = {
        emailAddress: email,
        accessCode: accessCode,
      };
      props.requestOtp(data);
    }
  };

  const isValidateInput = () => {
    if (!validateEmail(email)) {
      setValidation('Invalid email address');
      return false;
    }
    if (isStringNullOrEmpty(accessCode)) {
      setValidation('Invalid password');
      return false;
    }
    setValidation('');
    return true;
  };

  const handleEmail = text => {
    setEmail(text);
    setValidation('');
  };
  const handleAccessCode = text => {
    setAccessCode(text);
    setValidation('');
  };

  const renderBackButton = () => {
    return (
      <View
        style={{position: 'absolute', top: 0, left: MarginConstants.halfTab}}>
        <TouchableWithoutFeedback
          onPress={() => {
            //console.log(props);
            props.navigation.goBack();
          }}>
          <Icon name="keyboard-arrow-left" size={35} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderErrorMessage = () => {
    if (props.isError) {
      let errorMessage = props.errorMessage.errorAlert
        ? props.errorMessage.errorAlert
        : props.errorMessage.message;
      return (
        <View style={loginStyles.errorMessageContainer}>
          <Text style={loginStyles.errorMessage}>{errorMessage}</Text>
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  const renderLocalValidation = () => {
    if (!StringUtils.isEmpty(validation)) {
      return (
        <View style={loginStyles.errorMessageContainer}>
          <Text style={loginStyles.errorMessage}>{validation}</Text>
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  const handleDialogCancel = () => {
    setOtpAlert(false);
  };

  const handleDialogDone = () => {
    if (!isStringNullOrEmpty(otp)) {
      let data = {
        emailAddress: email,
        accessCode: accessCode,
        otp: otp,
      };
      props.validateUserOtp(data);
    } else {
      setValidation('Enter OTP');
    }
  };

  const handleOnTextChange = text => {
    setOtp(text);
  };

  const renderDialog = () => {
    let errorMessage = 'One Time password(OTP)';
    let messageColor ='white';
    if (props.isError) {
      errorMessage = props.errorMessage.errorAlert
        ? props.errorMessage.errorAlert
        : props.errorMessage.message;

        messageColor= 'red';
    }
    return (
      <DialogContainer visible={otpAlert}>
        <DialogTitle>
          Please enter One Time Password received on your email{' '}
        </DialogTitle>
        <DialogInput
          labelStyle={{color: messageColor}}
          label={errorMessage}
          keyboardType={'numeric'}
          onChangeText={handleOnTextChange}
        />
        <DialogButton label={'Cancel'} onPress={handleDialogCancel} />
        <DialogButton label={'Done'} onPress={handleDialogDone} />
      </DialogContainer>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background_inverted.png')}
        style={{flex: 1}}>
        <View style={styles.forgotPswdContainer}>
          {renderBackButton()}
          <View
            style={{
              marginVertical: MarginConstants.tab4 * 3,
              alignItems: 'center',
              width: '100%',
            }}>
            <Image
              style={styles.logoImage}
              resizeMode="contain"
              source={require('../images/whiteCXLogo.png')}
            />
            <Text
              style={{
                fontSize: 15,
                width: '90%',
                textAlign: 'center',
                fontFamily: fontFamily.Medium,
                color: textColors.primary,
                alignSelf: 'center',
                marginTop: MarginConstants.halfTab,
                paddingHorizontal: MarginConstants.tab2,
              }}>
              Please enter the details below and hit Reset Password button to
              reset your password.
            </Text>
            <QPTextField
              label={'Email Address'}
              style={styles.emailInput}
              onEndEdit={handleEmail}
            />
            <QPTextField
              label={'Company Code'}
              style={styles.passwordInput}
              onEndEdit={handleAccessCode}
            />

            {renderErrorMessage()}
            {renderLocalValidation()}

            {props.isLoading ? (
              <View style={loginStyles.nextButton}>
                <BarIndicator color="#2589E3" count={5} size={35} />
              </View>
            ) : (
              <QPButton
                style={styles.nextButton}
                onPress={onResetPasswordClick}
                buttonText={'Reset Password'}
              />
            )}
          </View>
        </View>
      </ImageBackground>

      {renderDialog()}
    </View>
  );
};

const mapStateToProps = state => {
  console.log('Forgot pswd State:');
  console.log(state);
  return {
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    forgotPasswordResponse: state.global.forgotPasswordResponse,
    validateOtpResponse: state.global.validateOtpResponse,
  };
};
const mapDispatchToProps = dispatch => ({
  requestOtp: data => {
    dispatch(clearError());
    dispatch(requestOtp(data));
  },
  validateUserOtp: data => {
    dispatch(clearError());
    dispatch(validateUserOtp(data));
  },
  clearError: () =>{
      dispatch(clearError(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPassword);

const styles = StyleSheet.create({
  logoImage: {
    width: '70%',
    marginTop: MarginConstants.tab4,
  },
  forgotPswdContainer: {
    flex: 1,
    marginVertical: MarginConstants.tab3,
    alignItems: 'center',
    width: '100%',
  },
  navigationBar: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    alignItems: 'flex-start',
  },

  backButton: {
    color: textColors.primary,
    fontSize: Platform.isPad ? TextSizes.largeText : TextSizes.largeText,
  },
  emailInput: {
    width: screen.width / 1.1,
    height: MarginConstants.tab3,
    marginTop: MarginConstants.tab4,
    marginBottom: MarginConstants.tab2,
    paddingHorizontal: MarginConstants.halfTab,
  },
  passwordInput: {
    width: screen.width / 1.1,
    height: MarginConstants.tab3,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.halfTab,
  },
  nextButton: {
    width: '90%',
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: MarginConstants.tab4,
    borderRadius: 5,
    backgroundColor: buttonColors.backgroundColor,
  },
  nextText: {
    alignSelf: 'center',
    color: textColors.primary,
  },
});
