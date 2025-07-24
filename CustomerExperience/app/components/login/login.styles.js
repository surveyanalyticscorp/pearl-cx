import {Dimensions, Platform, StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';

let {width} = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: PaddingConstants.tab2,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoImage: {
    width: width * 0.75,
    height: width * 0.45,
  },
  logo: {
    width: width * 0.75,
    height: width * 0.45,
  },
  logoContainer: {
    width: width,
    alignItems: 'center',
  },
  emailInput: {
    width: width / 1.05,
    height: MarginConstants.tab4,
    marginBottom: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab1,
    fontFamily: FontFamily.regular,
  },
  emailInputText: {
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
  },
  signInButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
  },
  signInText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  forgotPasswordText: {
    alignSelf: 'center',
    color: Colors.accentLight,
    fontFamily: FontFamily.regular,
    fontSize: Platform.isPad ? TextSizes.largeText : TextSizes.primary,
  },
  forgotPswdButton: {
    height: MarginConstants.tab4,
    justifyContent: 'center',
    marginTop: MarginConstants.tab2,
    marginBottom: MarginConstants.tab2,
    backgroundColor: Colors.fullTransparent,
  },
});
