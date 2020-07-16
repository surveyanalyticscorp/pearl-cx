import {
  View,
  StyleSheet,
  ImageBackground,
  Platform,
  Image,
  TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {textColors, Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';
import QPTextField from '../widgets/TextField';
import QPButton from '../widgets/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
const screen = Dimensions.get('screen');
const CompanyCode = props => {
  const [accessCode, setAccessCode] = useState('');

  const signInButtonPressed = () => {
    //props.navigation.popToTop();
    if (accessCode.length > 2) {
      props.navigation.navigate('SignInScreen', {accessCode: accessCode});
    }
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
        style={styles.imageBackgroundContainer}>
        <View style={styles.companyCodeContainer}>
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
              label={'Company code'}
              style={styles.companyCodeInput}
              underlineColorAndroid="transparent"
              onEndEdit={handleAccessCode}
            />
            <QPButton onPress={signInButtonPressed} buttonText={'Next'} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CompanyCode;

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

  companyCodeContainer: {
    flex: 1,
    marginVertical: MarginConstants.tab3,
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: '70%',
    marginVertical: MarginConstants.tab4,
  },
  companyCodeInput: {
    width: screen.width / 1.1,
    height: MarginConstants.tab3,
    marginVertical: MarginConstants.tab4,
    paddingHorizontal: MarginConstants.halfTab,
    textAlign: 'left',
  },
  nextButton: {
    width: '90%',
    height: MarginConstants.tab3 * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: MarginConstants.tab3,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  nextText: {
    alignSelf: 'center',
    color: textColors.primary,
  },
});
