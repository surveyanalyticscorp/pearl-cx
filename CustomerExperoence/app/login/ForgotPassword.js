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

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const onSignInPress = () => {
    //props.navigation.navigate('SignInScreen');

    let data = {
      emailAddress: email,
      accessCode: accessCode,
    };
    apiHandler.forgotPassword(
      data,
      response => {
        console.log('Forgot pswd api response' + JSON.stringify(response));
        //response{"uniqueAPICallIdentifier":0,"body":{"message":"One time password has been sent to you registered email address"},"statusCode":200}
      },
      () => {},
    );
  };

  const onBackPress = () => {
    props.navigation.pop();
  };

  const handleEmail = text => {
    setEmail(text);
  };
  const handleAccessCode = text => {
    setAccessCode(text);
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background_inverted.png')}
        style={{flex: 1}}>
        <View style={styles.forgotPswdContainer}>
          <View style={styles.navigationBar}>
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: textColors.primary,
                  alignSelf: 'center',
                }}>
                Back
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                width: '100%',
                fontSize: 20,
                fontWeight: 'bold',
                color: textColors.primary,
                alignSelf: 'center',
              }}>
              Forgot Password?
            </Text>
          </View>

          <Text
            style={{
              fontSize: 15,
              color: textColors.primary,
              alignSelf: 'flex-start',
              marginTop: MarginConstants.tab3,
              paddingHorizontal: MarginConstants.tab2,
            }}>
            Please enter the details below and hit Reset Password button to
            reset your password.
          </Text>
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
            placeholder="Company Code"
            placeholderTextColor="#707070"
            autoCapitalize="none"
            onChangeText={handleAccessCode}
          />

          <TouchableOpacity style={styles.nextButton} onPress={onSignInPress}>
            <Text styele={styles.nextText}> Reset Password </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  forgotPswdContainer: {
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
});
