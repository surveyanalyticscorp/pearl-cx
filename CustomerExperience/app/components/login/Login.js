import {Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {isStringNullOrEmpty, showErrorFlashMessage, validateEmail} from '../../Utils/Utility';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import {connect} from 'react-redux';
import {clearError, showLoading} from '../../redux/actions/index';
import {authenticatePanel, doLogin} from '../../redux/actions/login.actions';
import {loginStyles} from './login.styles';
import StringUtils from '../../Utils/StringUtils';
import {Colors} from '../../styles/color.constants';
import QPSpinner from '../../widgets/QPSpinner';
import SafeAreaView from 'react-native-safe-area-view';
import {setDynamicLink} from '../../redux/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_PUSH_TOKEN, BASE_URL} from '../../api/Constant';
import {checkNotificationPermission} from '../../Utils/NotificationUtils';

const stringConst = require('../../config/locales/en');

const Login = props => {
    let timer = useRef(null);
    let textFieldTimer = useRef(null);

    const [userData, setUserData] = useState({
        email: '',
        password: '',
        accessCode:''
    });

    const [validation, setValidation] = useState('');

    useEffect(() => {
        return function cleanup() {
            props.clearError();
            clearTimeout(timer);
            clearTimeout(textFieldTimer);
        };
    },[]);

    useEffect(() => {
        if (StringUtils.isNotEmpty(validation) || props.isError) {
            let message = props.isError ? props.errorMessage.errorAlert : validation;
            showErrorFlashMessage(message);
            timer = setTimeout(() => {
                setValidation('')
            }, 1000);
        }
    }, [validation, props.isError]);

    useEffect(() => {
        if(props.baseUrl && StringUtils.isNotEmpty(props.baseUrl)){
            AsyncStorage.setItem(BASE_URL, props.baseUrl).then();
            global.baseUrl = props.baseUrl;
            onSignInPress();
        }
    },[props.baseUrl]);

    const onSignInPress = () => {
        Keyboard.dismiss();
        AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then((token) => {
            if(isStringNullOrEmpty(token)) {
                checkNotificationPermission().then(() => onSignInPress());
            } else {
                loginAction(token)
            }
        })
    };

    let authenticateAccessCode = () =>{
        if(checkValidation() && StringUtils.isEmpty(props.baseUrl)) {
            props.authenticatePanel({accessCode: userData.accessCode});
        }
    };

    let loginAction = (token) => {
        if (checkValidation()) {
            let data = {
                accessCode: userData.accessCode,
                emailAddress: userData.email,
                password: userData.password,
                platform: Platform.OS,
                sourceMode: 'email',
                udId: DeviceInfo.getUniqueId(),
                pushToken: token
            };
            if(StringUtils.isNotEmpty(props.dynamicLink) && props.dynamicLink.includes('resetpassword')) {
                props.resetPasswordLink()
            }
            props.loginClick(data);
        }
    };

    const checkValidation = () => {
        if (!validateEmail((userData.email))) {
            setValidation(stringConst.onBoarding.invalidEmail);
            return false;
        }
        if (isStringNullOrEmpty(userData.password)) {
            setValidation(stringConst.onBoarding.invalidPassword);
            return false;
        }

        if (isStringNullOrEmpty(userData.accessCode)) {
            setValidation(stringConst.onBoarding.invalidCompanyCode);
            return false;
        }
        setValidation('');
        return true;
    };

    const onForgotPasswordPress = () => {
        props.clearError();
        Keyboard.dismiss();
        props.navigation.navigate('ForgotPassword', {
            email: userData.email,
            accessCode: userData.accessCode,
        });
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

    const handleAccessCode = text => {
        if (userData.accessCode !== text) {
            setUserData({
                ...userData,
                accessCode: text,
            });
        }
    };


    const handleSubmit = text =>{
        authenticateAccessCode();
    };

    let renderSpinnerLoginButton = () => {
        return props.isLoading ?
            <View style={loginStyles.signInButton}>
                <QPSpinner spinnerColor={Colors.white}/>
            </View>
            :
            <QPButton
                testID='SignInButton'
                style={loginStyles.signInButton}
                onPress={authenticateAccessCode}
                buttonText={stringConst.onBoarding.signIn}
                textStyle={loginStyles.signInText}
            />
    };

    const renderSignTextFieldAndButton = () => {
        return (
            <ScrollView contentContainerStyle={loginStyles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
            >
                <KeyboardAvoidingView behavior='position'
                                      style={loginStyles.container}
                                      keyboardVerticalOffset={Platform.select({
                                          ios: Platform.isPad ? -200 : -100,
                                          android: -200
                                      })}
                                      enabled>
                    <View style={{flex:1}}>
                        <View style={loginStyles.logo}>
                            <Image
                                style={loginStyles.logoImage}
                                resizeMode="contain"
                                source={require('../../config/images/cx-logo.png')}
                            />
                        </View>
                        <QPTextField
                            testID='emailTextField'
                            autofocus={false}
                            label={stringConst.onBoarding.email}
                            defaultValue={''}
                            style={loginStyles.emailInput}
                            onEndEdit={handleEmail}
                            onChange={handleEmail}
                            onSubmitEditing={() => {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            }}
                        />
                        <QPTextField
                            testID='passwordTextField'
                            secureText={true}
                            label={stringConst.onBoarding.password}
                            defaultValue={''}
                            style={loginStyles.emailInput}
                            onEndEdit={handlePassword}
                            onChange={handlePassword}
                            onSubmitEditing={() => {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            }}
                            value={userData.password}
                        />
                        <QPTextField
                            testID='companyCodeTextField'
                            defaultValue={''}
                            label={stringConst.onBoarding.companyCode}
                            style={loginStyles.emailInput}
                            onChange={handleAccessCode}
                            onEndEdit={handleSubmit}
                            onSubmitEditing={() => {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            }}
                            value={userData.accessCode}
                            returnKey = {'done'}
                        />
                        <QPButton
                            style={loginStyles.forgotPswdButton}
                            onPress={onForgotPasswordPress}
                            textStyle={loginStyles.forgotPasswordText}
                            buttonText={stringConst.onBoarding.forgotPassword}
                        />
                    </View>
                </KeyboardAvoidingView>
                {renderSpinnerLoginButton()}
            </ScrollView>
        );
    };

    return (
        <ImageBackground
            resizeMode={'cover'}
            source={require('../../config/images/background1.png')}
            style={loginStyles.container}>
            <SafeAreaView forceInset={{top: 'always',bottom:'never'}} style={loginStyles.safeArea}>
                {renderSignTextFieldAndButton()}
            </SafeAreaView>
        </ImageBackground>
    );
};

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        dynamicLink: state.global.dynamicLink,
        baseUrl: state.global.baseUrl
    };
};

const mapDispatchToProps = dispatch => ({
    authenticatePanel : param =>{
        dispatch(clearError());
        dispatch(authenticatePanel(param))
    },
    loginClick: data => {
        dispatch(clearError());
        dispatch(doLogin(data));
        dispatch(showLoading(true));
    },
    clearError: () => {
        dispatch(clearError(false));
    },
    resetPasswordLink: () => {
        dispatch(setDynamicLink(''))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
