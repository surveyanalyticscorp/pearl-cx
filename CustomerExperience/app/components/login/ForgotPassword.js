import {
    Dimensions,
    Image,
    ImageBackground, Keyboard, KeyboardAvoidingView, Platform,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {MarginConstants} from '../../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../../styles/color.constants';
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
let { height, width }= Dimensions.get('window');

const stringConst = require('../../config/locales/en');
const screen = Dimensions.get('screen');

const ForgotPassword = props => {
    const [email, setEmail] = useState('');
    const [accessCode, setAccessCode] = useState('');
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
        if (StringUtils.isNotEmpty(validation)) {
            showMessage({
                message: validation,
                type: 'danger',
                icon: 'auto',
                backgroundColor: Colors.red,
                color: Colors.white, // text color
            });
            let timer = setTimeout(() => {
                setValidation('')
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [validation]);

    useEffect(() => {
        if (props.isError) {
            showMessage({
                message: props.errorMessage.errorAlert,
                type: 'danger',
                icon: 'auto',
                backgroundColor: Colors.red,
                color: Colors.white, // text color
            });
            let timer = setTimeout(() => {
                props.clearError();
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [props.isError]);

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
                            source={require('../../config/images/whiteCXLogo.png')}
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
                    defaultValue={''}
                    style={styles.emailInput}
                    onEndEdit={handleEmail}
                    onSubmitEditing={() => {
                        textFieldTimer = setTimeout(() => {
                            Keyboard.dismiss()
                        }, 5);
                    }}
                    clearButtonMode={'while-editing'}
                />
                <QPTextField
                    defaultValue={''}
                    label={stringConst.companyCode}
                    style={styles.companyCode}
                    onEndEdit={handleAccessCode}
                    onSubmitEditing={() => {
                        textFieldTimer = setTimeout(() => {
                            Keyboard.dismiss()
                        }, 5);
                    }}
                    clearButtonMode={'while-editing'}
                />
                {renderSpinnerResetButton()}
            </View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    };

    return (
        <ImageBackground
            resizeMode={'cover'}
            source={require('../../config/images/background_inverted.png')}
            style={styles.container}>
            <SafeAreaView>
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
    textFieldContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: MarginConstants.tab3
    },
    navigationBar: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: Colors.accent,
        alignItems: 'flex-start',
    },
    emailInput: {
        width: screen.width / 1.1,
        height: MarginConstants.tab3,
        marginTop: MarginConstants.tab2,
        marginBottom: MarginConstants.tab2,
        paddingHorizontal: MarginConstants.halfTab,
    },
    companyCode: {
        width: screen.width / 1.1,
        height: MarginConstants.tab3,
        marginTop: MarginConstants.tab2,
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
    forgotPasswordMessage: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: FontFamily.Light,
        color: textColors.primary,
        alignSelf: 'center',
        marginTop: MarginConstants.halfTab,
    }

});
