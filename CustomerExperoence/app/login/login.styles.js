import {Platform, StyleSheet, Dimensions} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {fontFamily} from '../styles/font.constants';
const screen = Dimensions.get('screen');

export const loginStyles = StyleSheet.create({
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
