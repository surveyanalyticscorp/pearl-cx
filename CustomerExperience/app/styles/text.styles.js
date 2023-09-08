import {Dimensions, Platform, StyleSheet} from 'react-native';
import {MarginConstants} from './margin.constants';
import {FontFamily} from './font.constants';
import {TextSizes} from './textsize.constants';
import {Colors} from './color.constants';

let {width} = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
export const textStyles = StyleSheet.create({
  primaryButton: {
    height: MarginConstants.tab4,
    paddingHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
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
    fontSize: TextSizes.largeText,
  },

  transparentButton: {
    height: MarginConstants.tab4,
    paddingHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.filterIconColor,
    borderWidth: 1,
  },
  transparentButtonText: {
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  secondaryText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
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
