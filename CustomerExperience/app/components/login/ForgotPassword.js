import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import QPButton from '../../widgets/Button';
import {useDispatch, useSelector} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
let {width} = Dimensions.get('window');
import {translate} from '../../Utils/MultilinguaUtils';
import AccessCodeTextInput from './components/AccessCodeTextInput';
import EmailTextInput from './components/EmailTextInput';
import CXLogo from './components/CXLogo';
import LoginBackground from './components/LoginBackground';
import {useState} from 'react';
import useForgotPasswordProcess from './components/hooks/useForgotPasswordProcess';
import {clearResetPasswordLinkResponse} from '../../redux/actions/login.actions';
import {showSuccessFlashMessage} from '../../Utils/Utility';

let RenderSpinnerResetButton = ({resetData}) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();

  const {onResetPasswordClick} = useForgotPasswordProcess(resetData);
  const {isLoading, resetPasswordLinkResponse} = useSelector(
    state => state.global,
  );
  useEffect(() => {
    if (resetPasswordLinkResponse?.message) {
      dispatch(clearResetPasswordLinkResponse());
      showSuccessFlashMessage('Reset password link sent to your email');
    }
  }, [resetPasswordLinkResponse]);

  return isLoading ? (
    <View style={styles.resetPswdButton}>
      <QPSpinner testID="loading-indicator" spinnerColor={Colors.white} />
    </View>
  ) : (
    <QPButton
      testID="SignInButton"
      style={styles.resetPswdButton}
      onPress={onResetPasswordClick}
      buttonText={translate('onBoarding.resetPassword')}
      textStyle={styles.nextText}
    />
  );
};

const ForgotPassword = props => {
  console.log('NAVIGATION_LOGIN', props.route.name);
  console.log('NAVIGATION_LOGIN', JSON.stringify(props));

  const [resetData, setResetData] = useState({email: '', accessCode: ''});
  const setEmail = email => {
    setResetData({...resetData, email});
  };
  const setAccessCode = accessCode => {
    setResetData({...resetData, accessCode});
  };

  return (
    <LoginBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}>
        <KeyboardAvoidingView
          behavior="position"
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: Platform.isPad ? -200 : -150,
            android: -200,
          })}
          enabled>
          <CXLogo />
          <View style={styles.textFieldContainer}>
            <Text style={styles.forgotPasswordMessage}>
              {translate('onBoarding.forgotPasswordMessage')}
            </Text>
            <EmailTextInput setEmail={setEmail} />
            <AccessCodeTextInput setAccessCode={setAccessCode} />
          </View>
        </KeyboardAvoidingView>
        <RenderSpinnerResetButton {...props} resetData={resetData} />
      </ScrollView>
    </LoginBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  textFieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: width / 1.05,
    height: MarginConstants.tab4,
    marginBottom: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab1,
  },
  resetPswdButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab1,
  },
  nextText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  forgotPasswordMessage: {
    fontSize: TextSizes.secondary,
    textAlign: 'center',
    fontFamily: FontFamily.light,
    color: Colors.primary,
    alignSelf: 'center',
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab2,
  },
});
