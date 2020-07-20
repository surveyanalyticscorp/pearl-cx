import {
  Image,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {MarginConstants} from '../styles/margin.constants';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN, USER_INFO} from '../api/types';
import {isStringNullOrEmpty, validateEmail} from '../Utils/Utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QPTextField from '../widgets/TextField';
import QPButton from '../widgets/Button';
import {connect} from 'react-redux';
import {doLogin, showLoading, setIsLogin} from '../actions';
import {loginStyles} from './login.styles';
import {BarIndicator} from 'react-native-indicators';

const SignInScreen = props => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const saveData = async () => {
      await AsyncStorage.setItem(AUTH_TOKEN, props.userInfo.authToken);
      await AsyncStorage.setItem(
        USER_INFO,
        JSON.stringify(props.userInfo.body),
      );

      props.setIsLogin();
    };
    if (props.userInfo.authToken) {
      saveData();
    }
  }, [props, props.userInfo]);

  const onSignInPress = () => {
    if (
      validateEmail(userData.email) &&
      !isStringNullOrEmpty(userData.password)
    ) {
      let data = {
        accessCode: props.route.params.accessCode,
        emailAddress: userData.email,
        password: userData.password,
        platform: Platform.OS,
        sourceMode: 'email',
        udId: DeviceInfo.getUniqueId(),
      };

      props.loginClick(data);
    }
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
            console.log(props);
            props.navigation.goBack();
          }}>
          <Icon name="keyboard-arrow-left" size={35} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
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
  };
};

const mapDispatchToProps = dispatch => ({
  loginClick: data => {
    dispatch(doLogin(data));
    dispatch(showLoading(true));
  },

  setIsLogin: () => {
    dispatch(setIsLogin(true));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);
