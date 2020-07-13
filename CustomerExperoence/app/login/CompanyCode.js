import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import {textColors, Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';

const CompanyCode = props => {
  const onPress = () => {
    props.navigation.navigate('SignInScreen');
  };

  const handleEmail = text => {};

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background_inverted.png')}
        style={styles.imageBackgroundContainer}>
        <View style={styles.companyCodeContainer}>
          <Image
            style={styles.logoImage}
            resizeMode="contain"
            source={require('../images/login_logo.png')}
          />
          <TextInput
            style={styles.companyCodeInput}
            underlineColorAndroid="transparent"
            placeholder="Company Code"
            placeholderTextColor="#707070"
            autoCapitalize="none"
            onChangeText={handleEmail}
          />
          <TouchableOpacity style={styles.nextButton} onPress={onPress}>
            <Text styele={styles.nextText}> Next </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.companyCode}>Company Code </Text>
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
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: '70%',
  },
  companyCodeInput: {
    width: '90%',
    marginVertical: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab2,
    textAlign: 'left',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: MarginConstants.tab3,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  nextText: {
    alignSelf: 'center',
    color: textColors.primary,
  },
});
