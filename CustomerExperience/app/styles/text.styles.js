import {Dimensions, Platform, StyleSheet} from 'react-native';
import {MarginConstants} from './margin.constants';
import {FontFamily} from './font.constants';
import {TextSizes} from './textsize.constants';
import {Colors} from './color.constants';

let {width} = Dimensions.get('window');
const isIos = Platform.OS === 'ios';

export const baseTextStyles = StyleSheet.create({
  donutPercentRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.donutPercentText,
    marginHorizontal: MarginConstants.halfTab,
  },
  extraLargeRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.extraLargeText,
    marginHorizontal: MarginConstants.halfTab,
  },
  largeRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    marginHorizontal: MarginConstants.halfTab,
  },
  primaryRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    marginHorizontal: MarginConstants.halfTab,
  },
  secondaryRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.halfTab,
  },
  semiSecondaryRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.semiSecondary,
    marginHorizontal: MarginConstants.halfTab,
  },
  semiMediumRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.semiMediumText,
    marginHorizontal: MarginConstants.halfTab,
  },
  mediumRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    marginHorizontal: MarginConstants.halfTab,
  },
  smallRegularText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.smallText,
    marginHorizontal: MarginConstants.halfTab,
  },
  donutPercentMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.donutPercentText,
    marginHorizontal: MarginConstants.halfTab,
  },
  extraLargeMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.extraLargeText,
    marginHorizontal: MarginConstants.halfTab,
  },
  largeMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    marginHorizontal: MarginConstants.halfTab,
  },
  primaryMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    marginHorizontal: MarginConstants.halfTab,
  },
  secondaryMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.halfTab,
  },
  semiSecondaryMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.semiSecondary,
    marginHorizontal: MarginConstants.halfTab,
  },
  semiMediumMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.semiMediumText,
    marginHorizontal: MarginConstants.halfTab,
  },
  mediumMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.mediumText,
    marginHorizontal: MarginConstants.halfTab,
  },
  smallMediumText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.smallText,
    marginHorizontal: MarginConstants.halfTab,
  },
});

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
    ...baseTextStyles.largeRegularText,
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
    ...baseTextStyles.largeRegularText,
  },
  secondaryText: {
    ...baseTextStyles.secondaryRegularText,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  secondaryTextAccentColor: {
    ...baseTextStyles.secondaryRegularText,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.accentLight,
  },
  secondaryTextBold: {
    ...baseTextStyles.secondaryRegularText,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
    fontWeight: 'bold',
  },
  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  optionTextBold: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
    fontWeight: 'bold',
  },

  npsScoreTextBold: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.donutPercentText,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
    fontWeight: 'bold',
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
