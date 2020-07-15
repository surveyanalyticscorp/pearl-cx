import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {MarginConstants} from '../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {apiHandler} from '../api/ApiHandler';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../api/types';
import {isStringNullOrEmpty, validateEmail} from '../Utils/Utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QPTextField from '../widgets/TextField';
import QPButton from '../widgets/Button';
import {fontFamily} from '../styles/font.constants';
const screen = Dimensions.get('screen');
const SignInScreen = props => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

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

      apiHandler.login(
        data,
        async response => {
          console.log('Login response: ' + JSON.stringify(response));
          if (response.statusCode == 200) {
            try {
              await AsyncStorage.setItem(AUTH_TOKEN, response.authToken);
              props.navigation.navigate('');
            } catch (e) {
              console.log(e);
            }
          } else {
            errorHandle();
          }
        },
        () => {},
      );
    }
  };

  const errorHandle = () => {};

  const onForgotPasswordPress = () => {
    props.navigation.navigate('ForgotPassword');
  };

  const onBackPress = () => {
    props.navigation.pop();
  };

  const handleEmail = text => {
    setUserData({
      ...userData,
      email: text,
    });
  };

  const handlePassword = text => {
    //setPassword(text);
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

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background_inverted.png')}
        style={styles.imageBackgroundContainer}>
        <View style={styles.signInInContainer}>
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
            <QPTextField
              label={'Email Address'}
              style={styles.emailInput}
              onSubmit={handleEmail}
            />
            <QPTextField
              label={'Password'}
              style={styles.passwordInput}
              onSubmit={handlePassword}
            />
            <QPButton
              style={styles.nextButton}
              onPress={onSignInPress()}
              buttonText={'Sign In'}
            />

            <QPButton
              style={styles.forgotPswdButton}
              onPress={onForgotPasswordPress}
              textStyle={styles.nextText}
              buttonText={'Forgot Password?'}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyCode: {
    position: 'absolute',
    top: MarginConstants.tab2,
    left: MarginConstants.tab2,
    color: textColors.primary,
    fontSize: Platform.isPad ? TextSizes.largeText : TextSizes.largeText,
  },

  signInInContainer: {
    flex: 1,
    marginVertical: MarginConstants.tab3,
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: '70%',
    marginVertical: MarginConstants.tab4,
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
    alignSelf: 'flex-end',
    color: textColors.primary,
    fontFamily: fontFamily.SemiBold,
    fontSize: Platform.isPad ? TextSizes.primary : TextSizes.secondary,
  },
  forgotPswdButton: {
    width: '90%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: MarginConstants.tab1,
    borderRadius: 5,
    backgroundColor: Colors.fullTransparent,
  },
  backButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: textColors.primary,
    alignSelf: 'flex-start',
  },
});
