import {
    Image,
    ImageBackground,
    Platform,
    View,
    SafeAreaView, Keyboard, KeyboardAvoidingView, ScrollView
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN, ASYNC_USER_CREDENTIALS, ASYNC_USER_INFO} from '../../api/Constant';
import {isStringNullOrEmpty, validateEmail} from '../../Utils/Utility';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import {connect} from 'react-redux';
import {showLoading, clearError} from '../../redux/actions/index';
import {doLogin, setIsLogin} from '../../redux/actions/login.actions';
import {loginStyles} from './login.styles';
import {DotIndicator} from 'react-native-indicators';
import StringUtils from '../../Utils/StringUtils';
import {Colors} from '../../styles/color.constants';
import {showMessage} from 'react-native-flash-message';
import QPSpinner from '../../widgets/QPSpinner';

const stringConst = require('../../config/locales/en');

const Login = props => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    const [validation, setValidation] = useState('');

    useEffect(() => {
        return function cleanup() {
            props.clearError()
        };
    },[]);

    useEffect(() => {
        const saveData = async () => {
            await AsyncStorage.setItem(ASYNC_AUTH_TOKEN, props.userInfo.authToken);
            await AsyncStorage.setItem(ASYNC_USER_CREDENTIALS, JSON.stringify(userData));
            await AsyncStorage.setItem(
                ASYNC_USER_INFO,
                JSON.stringify(props.userInfo.body),
            );
            props.setIsLogin();
        };
        if (props.userInfo.authToken) {
            saveData().then(() => {});
        }
    }, [props.userInfo]);


    useEffect(() => {
        if (StringUtils.isNotEmpty(validation)) {
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
    }, [validation]);

    useEffect(() => {
        if (props.isError) {
            showMessage({
                message: props.errorMessage.errorAlert,
                type: 'danger',
                icon: 'auto',
                backgroundColor: Colors.red,
                color: Colors.white,
            });
            let timer = setTimeout(() => {
                props.clearError();
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [props.isError]);

    const onSignInPress = () => {
        Keyboard.dismiss();
        if (checkValidation()) {
            let data = {
                accessCode: props.route.params.accessCode,
                emailAddress: userData.email,
                password: userData.password,
                platform: Platform.OS,
                sourceMode: 'email',
                udId: DeviceInfo.getUniqueId(),
            };

            props.loginClick(data);
        } else {

        }
    };

    const checkValidation = () => {
        if (!validateEmail((userData.email))) {
            setValidation(stringConst.invalidEmail);
            return false;
        }
        if (isStringNullOrEmpty(userData.password)) {
            setValidation(stringConst.invalidPassword);
            return false;
        }
        setValidation('');
        return true;
    };

    const onForgotPasswordPress = () => {
        Keyboard.dismiss();
        props.navigation.navigate('ForgotPassword');
    };

    const handleEmail = text => {
        if (userData.email !== text) {
            setUserData({
                ...userData,
                email: text,
            });
        }
    };

    const handlePassword = text => {
        if (userData.password !== text) {
            setUserData({
                ...userData,
                password: text,
            });
        }
    };

    let renderSpinnerLoginButton = () => {
        return props.isLoading ?
            <View style={loginStyles.nextButton}>
                <QPSpinner spinnerColor={Colors.white}/>
            </View>
            :
            <QPButton
                testID='SignInButton'
                style={loginStyles.nextButton}
                onPress={onSignInPress}
                buttonText={stringConst.signIn}
            />
    };

    const renderSignTextFieldAndButton = () => {
        return (
            <ScrollView contentContainerStyle={loginStyles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
                        onStartShouldSetResponder={handleUnhandledTouches}
            >
                <KeyboardAvoidingView behavior='position'
                                      style={loginStyles.container}
                                      keyboardVerticalOffset={Platform.select({
                                          ios: Platform.isPad ? -200 : -150,
                                          android: -200
                                      })}
                                      enabled>
                    <View style={loginStyles.logo}>
                        <Image
                            style={loginStyles.logoImage}
                            resizeMode="contain"
                            source={require('../../config/images/whiteCXLogo.png')}
                        />
                    </View>
                    <View style={loginStyles.textFieldContainer}>

                        <QPTextField
                            testID='emailTextField'
                            autofocus={true}
                            label={stringConst.email}
                            defaultValue={''}
                            style={loginStyles.emailInput}
                            onEndEdit={handleEmail}
                            onChange={handleEmail}
                        />
                        <QPTextField
                            testID='passwordTextField'
                            secureText={true}
                            label={stringConst.password}
                            defaultValue={''}
                            style={loginStyles.passwordInput}
                            onEndEdit={handlePassword}
                            onChange={handlePassword}
                        />
                        {renderSpinnerLoginButton()}
                        <QPButton
                            style={loginStyles.forgotPswdButton}
                            onPress={onForgotPasswordPress}
                            textStyle={loginStyles.nextText}
                            buttonText={stringConst.forgotPassword}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
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
            style={loginStyles.container}>
            <SafeAreaView>
                {renderSignTextFieldAndButton()}
            </SafeAreaView>
        </ImageBackground>
    );
};

const mapStateToProps = state => {
    return {
        userInfo: state.global.userInfo,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
    };
};

const mapDispatchToProps = dispatch => ({
    loginClick: data => {
        dispatch(clearError());
        dispatch(doLogin(data));
        dispatch(showLoading(true));
    },
    clearError: () => {
        dispatch(clearError(false));
    },
    setIsLogin: () => {
        dispatch(setIsLogin(true));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
