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
import {MarginConstants} from '../../styles/margin.constants';
import {FontFamily} from '../../styles/font.constants';
import {Colors} from '../../styles/color.constants';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import React, {useEffect, useRef, useState} from 'react';
import {clearError} from '../../redux/actions/index';
import {updatePassword} from '../../redux/actions/login.actions';
import {connect} from 'react-redux';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import StringUtils from '../../Utils/StringUtils';
import {showMessage} from 'react-native-flash-message';
import {PaddingConstants} from '../../styles/padding.constants';
import SafeAreaView from 'react-native-safe-area-view';
import QPSpinner from '../../widgets/QPSpinner';
import {TextSizes} from '../../styles/textsize.constants';

let { width }= Dimensions.get('window');
const stringConst = require('../../config/locales/en');

const ResetPassword = props => {
    const [password, setPassword] = useState('');
    const [confirmPswd, setConfirmPswd] = useState('');
    const [validation, setValidation] = useState('');
    let textFieldTimer = useRef(null);

    useEffect(() => {
        if (props.updatePasswordResponse.body) {
            showMessage({
                message: props.updatePasswordResponse.body.message,
                type: 'info',
                icon: 'auto',
            });
            props.navigation.pop();
        }
    }, [props.updatePasswordResponse]);

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
                setValidation('');
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

    const onUpdatePasswordClick = () => {
        if (isValidateInput()) {
            let data = {
                emailAddress: props.route.params.email,
                accessCode: props.route.params.accessCode,
                password: password,
            };
            props.updatePassword(data);
        }
    };

    const isValidateInput = () => {
        if (isStringNullOrEmpty(password)) {
            setValidation(stringConst.invalidPassword);
            return false;
        }
        if (isStringNullOrEmpty(confirmPswd)) {
            setValidation(stringConst.invalidPassword);
            return false;
        }
        if (password !== confirmPswd) {
            setValidation(stringConst.passwordNotMatching);
            return false;
        }
        setValidation('');
        return true;
    };

    const handlePassword = text => {
        setPassword(text);
        setValidation('');
    };

    const handleConfirmPassword = text => {
        setConfirmPswd(text);
        setValidation('');
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
                onPress={onUpdatePasswordClick}
                buttonText={'Update Password'}
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
                            style={styles.resetPasswordMessage}>
                            {stringConst.resetPasswordMessage}
                        </Text>
                        <QPTextField
                            autofocus={false}
                            label={'Password'}
                            secureText={true}
                            defaultValue={''}
                            style={styles.textInput}
                            onEndEdit={handlePassword}
                            onSubmitEditing={() => {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            }}
                            clearButtonMode={'while-editing'}
                        />
                        <QPTextField
                            defaultValue={''}
                            secureText={true}
                            label={'Confirm Password'}
                            style={styles.textInput}
                            onEndEdit={handleConfirmPassword}
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
        </ImageBackground>
    );
};

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        updatePasswordResponse: state.global.updatePasswordResponse,
    };
};
const mapDispatchToProps = dispatch => ({
    clearError: () => {
        dispatch(clearError(false));
    },
    updatePassword: data => {
        dispatch(updatePassword(data));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResetPassword);

const styles = StyleSheet.create({
    safeArea:{
        flex:1
    },
    container:{
        flex: 1,
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
        marginBottom: MarginConstants.tab3,
        marginHorizontal: MarginConstants.tab1
    },
    nextText: {
        color: Colors.white,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.largeText
    },
    resetPasswordMessage: {
        fontSize: TextSizes.secondary,
        textAlign: 'center',
        fontFamily: FontFamily.light,
        color: Colors.primary,
        alignSelf: 'center',
        marginVertical: MarginConstants.tab1,
        marginHorizontal: MarginConstants.tab2
    }

});
