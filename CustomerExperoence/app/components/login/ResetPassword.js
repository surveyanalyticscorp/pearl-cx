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
import {MarginConstants} from '../../styles/margin.constants';
import {fontFamily} from '../../styles/font.constants';
import {buttonColors, Colors, textColors} from '../../styles/color.constants';
import QPTextField from '../../widgets/TextField';
import {loginStyles} from './login.styles';
import BarIndicator from 'react-native-indicators/src/components/bar-indicator';
import QPButton from '../../widgets/Button';
import React, {useEffect, useState} from 'react';
import {clearError} from '../../redux/actions/index';
import {updatePassword} from '../../redux/actions/login.actions';
import {connect} from 'react-redux';
import {TextSizes} from '../../styles/textsize.constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import StringUtils from '../../Utils/StringUtils';
import {showMessage} from 'react-native-flash-message';
const screen = Dimensions.get('screen');
const stringConst = require('../../config/locales/en');

const ResetPassword = props => {
  const [password, setPassword] = useState('');
  const [confirmPswd, setConfirmPswd] = useState('');
  const [validation, setValidation] = useState('');

  useEffect(() => {
    if (props.updatePasswordResponse.body) {
      showMessage({
        message: props.updatePasswordResponse.body.message,
        type: 'info',
        icon: 'auto',
      });
      props.navigation.pop();
    }
  }, [props.updatePasswordResponse]);

  const renderBackButton = () => {
    return (
      <View
        style={{position: 'absolute', top: 0, left: MarginConstants.halfTab}}>
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(props);
            props.navigation.goBack();
          }}>
          <Icon name="keyboard-arrow-left" size={35} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const onUpdatePasswordClick = () => {
    if (isValidateInput()) {
      let data = {
        emailAddress: props.route.params.email,
        accessCode: props.route.params.accessCode,
        password: password,
      };
      props.updatePassword(data);
    }
  };

  const isValidateInput = () => {
    if (isStringNullOrEmpty(password)) {
      setValidation(stringConst.invalidPassword);
      return false;
    }
    if (isStringNullOrEmpty(confirmPswd)) {
      setValidation(stringConst.invalidPassword);
      return false;
    }
    if (password !== confirmPswd) {
      setValidation(stringConst.passwordNotMatching);
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
    setConfirmPswd(text);
    setValidation('');
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

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../../images/background_inverted.png')}
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
              source={require('../../images/whiteCXLogo.png')}
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
                {stringConst.resetPasswordMessage}
            </Text>
            <QPTextField
              label={'Password'}
              style={styles.emailInput}
              onEndEdit={handlePassword}
            />
            <QPTextField
              label={'Confirm Password'}
              style={styles.passwordInput}
              onEndEdit={handleConfirmPassword}
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
                onPress={onUpdatePasswordClick}
                buttonText={'Update Password'}
              />
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const mapStateToProps = state => {
  console.log('Forgot reset pswd State:');
  console.log(state);
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPassword);

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
