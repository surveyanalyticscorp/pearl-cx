/* eslint-disable */
import {
  Image,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {MarginConstants} from '../styles/margin.constants';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN, ASYNC_USER_INFO} from '../api/types';
import {isStringNullOrEmpty, validateEmail} from '../Utils/Utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QPTextField from '../widgets/TextField';
import QPButton from '../widgets/Button';
import {connect} from 'react-redux';
import {doLogin, showLoading, setIsLogin, clearError} from '../actions';
import {loginStyles} from './login.styles';
import {BarIndicator} from 'react-native-indicators';
import StringUtils from '../Utils/StringUtils';

const SignInScreen = props => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [validation, setValidation] = useState('');

  useEffect(() => {
    const saveData = async () => {
      await AsyncStorage.setItem(ASYNC_AUTH_TOKEN, props.userInfo.authToken);
      await AsyncStorage.setItem(
        ASYNC_USER_INFO,
        JSON.stringify(props.userInfo.body),
      );

      props.setIsLogin();
    };
    if (props.userInfo.authToken) {
      saveData();
    }
  }, [props.userInfo]);

  const onSignInPress = () => {
    if (checkValidation()) {
      let data = {
        accessCode: props.route.params.accessCode,
        emailAddress: userData.email,
        password: userData.password,
        platform: Platform.OS,
        sourceMode: 'email',
        udId: DeviceInfo.getUniqueId(),
      };

      props.loginClick(data);
    }else{

    }
  };

  const checkValidation = () =>{
      if(!validateEmail((userData.email))){
        setValidation('Invalid email address');
        return false;
      }
      if(isStringNullOrEmpty(userData.password)){
          setValidation('Invalid password');
          return false;
      }
      setValidation('');
      return true;
  };

  const onForgotPasswordPress = () => {
    props.navigation.navigate('ForgotPassword');
  };

  const handleEmail = text => {
    setUserData({
      ...userData,
      email: text,
    });
  };

  const handlePassword = text => {
    setUserData({
      ...userData,
      password: text,
    });
  };

  const renderBackButton = () => {
    return (
      <View
        style={{position: 'absolute', top: 0, left: MarginConstants.halfTab}}>
        <TouchableWithoutFeedback
          onPress={() => {
              //console.log(props);
              props.clearError();
              props.navigation.goBack();
          }}>
          <Icon name="keyboard-arrow-left" size={35} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderErrorMessage = () => {
    if (props.isError) {
        let errorMessage = props.errorMessage.errorAlert ? (props.errorMessage.errorAlert) : (props.errorMessage.message);
      return (
        <View style={loginStyles.errorMessageContainer}>
          <Text style={loginStyles.errorMessage}>
            {errorMessage}
          </Text>
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

    const renderLocalValidation = () => {
        if (!StringUtils.isEmpty(validation)) {
            return (
                <View style={loginStyles.errorMessageContainer}>
                    <Text style={loginStyles.errorMessage}>
                        {validation}
                    </Text>
                </View>
            );
        }
        return <View style={{flex: 1}} />;
    };

  const renderSignTextFieldAndButton = () => {
    return (
      <View
        style={{
          marginVertical: MarginConstants.tab4 * 3,
          alignItems: 'center',
          width: '100%',
        }}>
        <Image
          style={loginStyles.logoImage}
          resizeMode="contain"
          source={require('../images/whiteCXLogo.png')}
        />
        <QPTextField
          label={'Email Address'}
          style={loginStyles.emailInput}
          onEndEdit={handleEmail}
        />
        <QPTextField
          secureText={true}
          label={'Password'}
          style={loginStyles.passwordInput}
          onEndEdit={handlePassword}
        />

        {renderErrorMessage()}
        {renderLocalValidation()}

        {props.isLoading ? (
          <View style={loginStyles.nextButton}>
            <BarIndicator color="#2589E3" count={5} size={35} />
          </View>
        ) : (
          <QPButton
            style={loginStyles.nextButton}
            onPress={onSignInPress}
            buttonText={'Sign In'}
          />
        )}

        <QPButton
          style={loginStyles.forgotPswdButton}
          onPress={onForgotPasswordPress}
          textStyle={loginStyles.nextText}
          buttonText={'Forgot Password?'}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background_inverted.png')}
        style={loginStyles.imageBackgroundContainer}>
        <View style={loginStyles.signInInContainer}>
          {renderBackButton()}
          {renderSignTextFieldAndButton()}
        </View>
      </ImageBackground>
    </View>
  );
};

const mapStateToProps = state => {
  console.log('SignIn State:');
  console.log(state);
  return {
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
  };
};

const mapDispatchToProps = dispatch => ({
  loginClick: data => {
    dispatch(clearError());
    dispatch(doLogin(data));
    dispatch(showLoading(true));
  },
    clearError : () =>{
      dispatch(clearError(false));
    },
    setIsLogin: () => {
      dispatch(setIsLogin(true));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);
