import {
    Dimensions,
    Image,
    ImageBackground, Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {MarginConstants} from '../../styles/margin.constants';
import {buttonColors, Colors, textColors} from '../../styles/color.constants';
import {isStringNullOrEmpty, validateEmail} from '../../Utils/Utility';
import {fontFamily} from '../../styles/font.constants';
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

const stringConst = require('../../config/locales/en');
const screen = Dimensions.get('screen');

const ForgotPassword = props => {
    const [email, setEmail] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [validation, setValidation] = useState('');
    const [otp, setOtp] = useState('');
    const [otpAlert, setOtpAlert] = useState(false);

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
    const handleUnhandledTouches = () => {
        Keyboard.dismiss();
        return false;
    };

    return (
        <ImageBackground
            resizeMode={'cover'}
            source={require('../../config/images/background_inverted.png')}
            style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                <View style={styles.forgotPswdContainer} onStartShouldSetResponder={handleUnhandledTouches}>
                    <Image
                        style={styles.logoImage}
                        resizeMode="contain"
                        source={require('../../config/images/whiteCXLogo.png')}
                    />
                    <Text
                        style={styles.forgotPasswordMessage}>
                        {stringConst.forgotPasswordMessage}
                    </Text>
                    <QPTextField
                        autofocus={true}
                        label={stringConst.email}
                        style={styles.emailInput}
                        onEndEdit={handleEmail}
                    />
                    <QPTextField
                        label={stringConst.companyCode}
                        style={styles.companyCode}
                        onEndEdit={handleAccessCode}
                    />
                    {props.isLoading ? (
                        <View style={styles.nextButton}>
                            <QPSpinner spinnerColor={Colors.white}/>
                        </View>
                    ) : (
                        <QPButton
                            style={styles.nextButton}
                            onPress={onResetPasswordClick}
                            buttonText={stringConst.resetPassword}
                        />
                    )}
                </View>
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
        backgroundColor: Colors.accent
    },
    logoImage: {
        width: '70%',
        marginTop: MarginConstants.tab4,
    },
    forgotPswdContainer: {
        flex: 1,
        marginVertical: MarginConstants.tab4 * 3 + MarginConstants.tab3,
        alignItems: 'center',
        width: '100%',
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
        marginTop: MarginConstants.tab4,
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
        alignSelf: 'center',
        color: textColors.primary,
    },
    forgotPasswordMessage: {
        fontSize: 15,
        width: '90%',
        textAlign: 'center',
        fontFamily: fontFamily.Medium,
        color: textColors.primary,
        alignSelf: 'center',
        marginTop: MarginConstants.halfTab,
        paddingHorizontal: MarginConstants.tab2,
    }

});
