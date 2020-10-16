import {
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {isStringNullOrEmpty, validateEmail} from '../../Utils/Utility';
import {FontFamily} from '../../styles/font.constants';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import {clearError} from '../../redux/actions/index';
import {requestOtp, validateUserOtp} from '../../redux/actions/login.actions';
import {connect} from 'react-redux';
import StringUtils from '../../Utils/StringUtils';
import {showMessage} from 'react-native-flash-message';
import DialogContainer from '../../widgets/dialog/Container';
import DialogTitle from '../../widgets/dialog/Title';
import DialogInput from '../../widgets/dialog/Input';
import DialogButton from '../../widgets/dialog/Button';
import QPSpinner from '../../widgets/QPSpinner';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import SafeAreaView from 'react-native-safe-area-view';

let { width }= Dimensions.get('window');
const stringConst = require('../../config/locales/en');

const ForgotPassword = props => {
    const [email, setEmail] = useState(props.route.params.email);
    const [accessCode, setAccessCode] = useState(props.route.params.accessCode);
    const [validation, setValidation] = useState('');
    const [otp, setOtp] = useState('');
    const [otpAlert, setOtpAlert] = useState(false);

    let textFieldTimer = useRef(null);

    useEffect(() => {
        if (props.forgotPasswordResponse.body) {
            showMessage({
                message: props.forgotPasswordResponse.body.message,
                type: 'info',
                icon: 'auto',
            });
            setOtpAlert(true);
        }
    }, [props.forgotPasswordResponse]);

    useEffect(() => {
        if (props.validateOtpResponse.body) {
            if (props.validateOtpResponse.body.success) {
                props.clearError();
                setOtpAlert(false);
                props.navigation.replace('ResetPassword', {
                    email: email,
                    accessCode: accessCode,
                });
            }
        }
    }, [props.validateOtpResponse]);


    useEffect(() => {
        if (StringUtils.isNotEmpty(validation) || props.isError) {
            showMessage({
                message: validation,
                type: 'danger',
                icon: 'auto',
                backgroundColor: Colors.red,
                color: Colors.white,
            });
            let timer = setTimeout(() => {
                setValidation('')
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [validation, props.isError]);

    const onResetPasswordClick = () => {
        if (isValidateInput()) {
            let data = {
                emailAddress: email,
                accessCode: accessCode,
            };
            props.requestOtp(data);
        }
    };

    const isValidateInput = () => {
        if (!validateEmail(email)) {
            setValidation(stringConst.invalidEmail);
            return false;
        }
        if (isStringNullOrEmpty(accessCode)) {
            setValidation(stringConst.invalidCompanyCode);
            return false;
        }
        setValidation('');
        return true;
    };

    const handleEmail = text => {
        setEmail(text);
        setValidation('');
    };
    const handleAccessCode = text => {
        setAccessCode(text);
        setValidation('');
    };

    const handleDialogCancel = () => {
        setOtpAlert(false);
    };

    const handleDialogDone = () => {
        if (!isStringNullOrEmpty(otp)) {
            let data = {
                emailAddress: email,
                accessCode: accessCode,
                otp: otp,
            };
            props.validateUserOtp(data);
        } else {
            setValidation(stringConst.otpRequired);
        }
    };

    const handleOnTextChange = text => {
        setOtp(text);
    };

    const renderDialog = () => {
        let errorMessage = 'One Time password(OTP)';
        let messageColor = Colors.white;
        if (props.isError) {
            errorMessage = props.errorMessage.errorAlert
                ? props.errorMessage.errorAlert
                : props.errorMessage.message;

            messageColor = Colors.red;
        }
        return (
            <DialogContainer visible={otpAlert}>
                <DialogTitle>
                    {stringConst.enterOtp}
                </DialogTitle>
                <DialogInput
                    labelStyle={{color: messageColor}}
                    label={errorMessage}
                    keyboardType={'numeric'}
                    onChangeText={handleOnTextChange}
                />
                <DialogButton label={stringConst.cancel} onPress={handleDialogCancel}/>
                <DialogButton label={stringConst.done} onPress={handleDialogDone}/>
            </DialogContainer>
        );
    };

    let renderSpinnerResetButton = () => {
        return props.isLoading ?
            <View style={styles.nextButton}>
                <QPSpinner spinnerColor={Colors.white}/>
            </View>
            :
            <QPButton
                testID='SignInButton'
                style={styles.nextButton}
                onPress={onResetPasswordClick}
                buttonText={stringConst.resetPassword}
                textStyle={styles.nextText}
            />
    };

    let renderContainer = () => {
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
            >
                <KeyboardAvoidingView behavior='position'
                                      style={styles.container}
                                      keyboardVerticalOffset={Platform.select({
                                          ios: Platform.isPad ? -200 : -150,
                                          android: -200
                                      })}
                                      enabled>
                    <View style={styles.logo}>
                        <Image
                            style={styles.logoImage}
                            resizeMode="contain"
                            source={require('../../config/images/cx-logo.png')}
                        />
                    </View>
                    <View style={styles.textFieldContainer}>
                        <Text
                            style={styles.forgotPasswordMessage}>
                            {stringConst.forgotPasswordMessage}
                        </Text>
                        <QPTextField
                            autofocus={false}
                            label={stringConst.email}
                            defaultValue={email}
                            style={styles.textInput}
                            onEndEdit={handleEmail}
                            onSubmitEditing={() => {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            }}
                            clearButtonMode={'while-editing'}
                        />
                        <QPTextField
                            defaultValue={accessCode}
                            label={stringConst.companyCode}
                            style={styles.textInput}
                            onEndEdit={handleAccessCode}
                            onSubmitEditing={() => {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            }}
                            clearButtonMode={'while-editing'}
                        />
                    </View>
                </KeyboardAvoidingView>
                {renderSpinnerResetButton()}
            </ScrollView>
        )
    };

    return (
        <ImageBackground
            resizeMode={'cover'}
            source={require('../../config/images/background1.png')}
            style={styles.container}>
            <SafeAreaView forceInset={{top: 'always',bottom:'never'}} style={styles.safeArea}>
                {renderContainer()}
            </SafeAreaView>
            {renderDialog()}
        </ImageBackground>

    );
};

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        forgotPasswordResponse: state.global.forgotPasswordResponse,
        validateOtpResponse: state.global.validateOtpResponse,
    };
};
const mapDispatchToProps = dispatch => ({
    requestOtp: data => {
        dispatch(requestOtp(data));
    },
    validateUserOtp: data => {
        dispatch(validateUserOtp(data));
    },
    clearError: () => {
        dispatch(clearError(false));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

const styles = StyleSheet.create({
    safeArea:{
        flex:1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: PaddingConstants.tab2
    },
    scrollContainer: {
        flexGrow: 1,
    },
    logoImage: {
        width: width * 0.75 ,
        height: width * 0.45,
    },
    logo: {
        alignItems: 'center'
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
    nextButton: {
        height: MarginConstants.tab4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.accent,
        marginBottom: MarginConstants.tab3
    },
    nextText: {
        color: Colors.white,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.largeText
    },
    forgotPasswordMessage: {
        fontSize: TextSizes.secondary,
        textAlign: 'center',
        fontFamily: FontFamily.light,
        color: Colors.primary,
        alignSelf: 'center',
        marginTop: MarginConstants.halfTab,
        marginHorizontal: MarginConstants.tab2
    }

});
