import {Dimensions, Platform, StyleSheet} from 'react-native';
import {MarginConstants} from './margin.constants';
import {FontFamily} from './font.constants';
import {TextSizes} from './textsize.constants';
import {Colors} from './color.constants';

let {width} = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
export const buttonStyles = StyleSheet.create({
  primaryButton: {
    height: MarginConstants.tab4,
    paddingHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accentLight,
    borderWidth: 1,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  },

  deleteButton: {
    height: MarginConstants.tab4,
    paddingHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.deleteBackground,
  },
  deleteButtonText: {
    color: Colors.deleteButtonText,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  },

  outlineButton: {
    height: MarginConstants.tab4,
    paddingHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.filterIconColor,
    borderWidth: 1,
  },
  outlineButtonText: {
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  },

  textButton: {
    height: MarginConstants.tab4,
    justifyContent: 'center',
    backgroundColor: Colors.transparent,
  },
  textButtonText: {
    color: Colors.accentLight,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  textButtonTextPrimary: {
    color: Colors.accentLight,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  },
});
// primaryButton: {
//   margin: MarginConstants.halfTab,
//   paddingVertical: isIos ? MarginConstants.tab2 : MarginConstants.halfTab,
//   paddingHorizontal: MarginConstants.tab2,
// },
// primaryButtonText: {
//   fontFamily: FontFamily.regular,
//   fontSize: isIos ? TextSizes.primary : TextSizes.secondary,
//   backgroundColor: Colors.accentLight,
//   borderRadius: 4,
//   color: Colors.white,
//   paddingVertical: MarginConstants.tab1,
//   paddingHorizontal: MarginConstants.tab2,
//   overflow: 'hidden',
// },
