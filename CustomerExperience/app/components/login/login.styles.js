import {Platform, StyleSheet, Dimensions} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {PaddingConstants} from '../../styles/padding.constants';
const screen = Dimensions.get('screen');
let { height, width }= Dimensions.get('window');


export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2*PaddingConstants.tab4
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoImage: {
    width: width * 0.75 ,
    height: width * 0.45,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emailInput: {
    width: screen.width / 1.1,
    height: MarginConstants.tab3,
    marginTop: MarginConstants.tab2,
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
    fontFamily: FontFamily.SemiBold,
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
  errorMessageContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: MarginConstants.tab2,
  },
  errorMessage: {
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.tab2,
    color: 'red',
  },
  textFieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
