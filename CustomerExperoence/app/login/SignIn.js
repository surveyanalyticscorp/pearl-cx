import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {MarginConstants} from '../styles/margin.constants';
import {Colors, textColors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {apiHandler} from '../api/ApiHandler';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../api/types';

const SignInScreen = props => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const onSignInPress = () => {
    props.navigation.navigate('SignInScreen');

    let data = {
      accessCode: props.route.params.accessCode,
      emailAddress: userData.email,
      password: userData.password,
      platform: Platform.OS,
      sourceMode: 'email',
      udId: DeviceInfo.getUniqueId(), //'d0edd045737f8a74',
    };

    apiHandler.login(
      data,
      async response => {
        console.log('Login response: ' + JSON.stringify(response.authToken));
        try {
          await AsyncStorage.setItem(AUTH_TOKEN, response.authToken);
        } catch (e) {
          console.log(e);
        }
      },
      () => {},
    );
  };
  const onForgotPswdPress = () => {
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

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background_inverted.png')}
        style={styles.imageBackgroundContainer}>
        <View style={styles.signInInContainer}>
          <Image
            style={styles.logoImage}
            resizeMode="contain"
            source={require('../images/login_logo.png')}
          />
          <TextInput
            style={styles.emailInput}
            underlineColorAndroid="transparent"
            placeholder="Email Address"
            placeholderTextColor="#707070"
            autoCapitalize="none"
            onChangeText={handleEmail}
          />
          <TextInput
            style={styles.passwordInput}
            underlineColorAndroid="transparent"
            placeholder="Password"
            placeholderTextColor="#707070"
            autoCapitalize="none"
            onChangeText={handlePassword}
          />

          <TouchableOpacity style={styles.nextButton} onPress={onSignInPress}>
            <Text styele={styles.nextText}> Sing In </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPswdButton}
            onPress={onForgotPswdPress}>
            <Text styele={styles.nextText}> Forgot Password? </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.companyCode} onPress={onBackPress}>
          <Text style={styles.backButton}>Back </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: '70%',
  },
  emailInput: {
    width: '90%',
    marginTop: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab2,
    textAlign: 'left',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    width: '90%',
    marginTop: MarginConstants.tab2,
    paddingHorizontal: MarginConstants.tab2,
    textAlign: 'left',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: MarginConstants.tab4,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  nextText: {
    alignSelf: 'center',
    color: textColors.primary,
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
