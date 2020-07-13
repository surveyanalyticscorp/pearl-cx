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
import Icon from 'react-native-vector-icons/MaterialIcons';
const HeaderBackButton = ({props}) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Icon name="chevron-left" size={35} color="white" />
    </TouchableOpacity>
  );
};

export default HeaderBackButton;

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
