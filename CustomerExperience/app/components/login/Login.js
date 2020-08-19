import {
    Image,
    ImageBackground,
    Platform,
    TouchableWithoutFeedback,
    View,
    SafeAreaView, Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {MarginConstants} from '../../styles/margin.constants';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN, ASYNC_USER_CREDENTIALS, ASYNC_USER_INFO} from '../../api/Constant';
import {isStringNullOrEmpty, validateEmail} from '../../Utils/Utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import {connect} from 'react-redux';
import {showLoading, clearError} from '../../redux/actions/index';
import {doLogin, setIsLogin} from '../../redux/actions/login.actions';
import {loginStyles} from './login.styles';
import {DotIndicator} from 'react-native-indicators';
import StringUtils from '../../Utils/StringUtils';

const stringConst = require('../../config/locales/en');
import {CommonActions} from '@react-navigation/native';
import {Colors} from '../../styles/color.constants';
import {showMessage} from 'react-native-flash-message';

const Login = props => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    const [validation, setValidation] = useState('');

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
            saveData().then(() => {
            });
        }
    }, [props.userInfo]);


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

    const renderBackButton = () => {
        return (
            <View
                style={{position: 'absolute', top: 0, left: MarginConstants.halfTab, flex: 0.05}}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        //console.log(props);
                        props.clearError();
                        const popAction = CommonActions.goBack();
                        props.navigation.dispatch(popAction);
                    }}>
                    <Icon name="keyboard-arrow-left" size={35} color="white"/>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    const renderSignTextFieldAndButton = () => {
        return (
            <View
                style={{
                    flex: 0.95,
                    marginVertical: MarginConstants.tab4 * 3,
                    alignItems: 'center',
                    width: '100%',
                }}>
                <Image
                    style={loginStyles.logoImage}
                    resizeMode="contain"
                    source={require('../../config/images/whiteCXLogo.png')}
                />
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

                {props.isLoading ? (
                    <View style={loginStyles.nextButton}>
                        <DotIndicator color={Colors.white} count={3} size={10}/>
                    </View>
                ) : (
                    <QPButton
                        testID='SignInButton'
                        style={loginStyles.nextButton}
                        onPress={onSignInPress}
                        buttonText={stringConst.signIn}
                    />
                )}

                <QPButton
                    style={loginStyles.forgotPswdButton}
                    onPress={onForgotPasswordPress}
                    textStyle={loginStyles.nextText}
                    buttonText={stringConst.forgotPassword}
                />
            </View>
        );
    };
    const handleUnhandledTouches = () => {
        Keyboard.dismiss();
        return false;
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.accent}}>
            <ImageBackground
                resizeMode={'stretch'}
                source={require('../../config/images/background_inverted.png')}
                style={loginStyles.imageBackgroundContainer}>
                <View style={loginStyles.signInInContainer} onStartShouldSetResponder={handleUnhandledTouches}>
                    {renderBackButton()}
                    {renderSignTextFieldAndButton()}
                </View>
            </ImageBackground>
        </SafeAreaView>
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
