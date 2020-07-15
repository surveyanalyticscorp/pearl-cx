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
import React, {useState} from 'react';
import {MarginConstants} from '../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {apiHandler} from '../api/ApiHandler';
import {isStringNullOrEmpty, validateEmail} from '../Utils/Utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fontFamily} from '../styles/font.constants';
import QPTextField from '../widgets/TextField';
import QPButton from '../widgets/Button';
const screen = Dimensions.get('screen');
const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const onSignInPress = () => {
    //props.navigation.navigate('SignInScreen');
    if (isValidateInput()) {
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
    }
  };

  const isValidateInput = () => {
    if (validateEmail(email) && !isStringNullOrEmpty(accessCode)) {
      return true;
    }
    return false;
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
              onSubmit={handleEmail}
            />
            <QPTextField
              label={'Company Code'}
              style={styles.passwordInput}
              onSubmit={handleAccessCode}
            />
            <QPButton
              style={styles.nextButton}
              onPress={onSignInPress()}
              buttonText={'Reset Password'}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ForgotPassword;

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
