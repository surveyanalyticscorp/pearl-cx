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
import {isObjectEmpty, isStringNullOrEmpty, showErrorFlashMessage, validateEmail} from '../../Utils/Utility';
import {FontFamily} from '../../styles/font.constants';
import QPTextField from '../../widgets/TextField';
import QPButton from '../../widgets/Button';
import {clearError, setDynamicLink, setUserDetailsForResetPassword} from '../../redux/actions/index';
import {connect} from 'react-redux';
import StringUtils from '../../Utils/StringUtils';
import QPSpinner from '../../widgets/QPSpinner';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_RESET_CREDENTIALS, BASE_URL} from '../../api/Constant';
import {authenticatePanel, requestPasswordLink, validateResetPasswordLink} from '../../redux/actions/login.actions';

let { width }= Dimensions.get('window');
const stringConst = require('../../config/locales/en');

const ForgotPassword = props => {
    const [email, setEmail] = useState(props.route.params.email);
    const [accessCode, setAccessCode] = useState(props.route.params.accessCode);
    const [validation, setValidation] = useState('');

    let textFieldTimer = useRef(null);

    useEffect(() => {
        if(props.route && props.route.params && props.route.params.timestamp && StringUtils.isNotEmpty(props.dynamicLink)) {
            let time = props.route.params.timestamp.replace("+", " ");
            if(StringUtils.isNotEmpty(props.dynamicLink)) {
                let data = {
                    emailAddress: email,
                    accessCode: accessCode,
                    timestamp: time
                };
                props.validatePasswordLink(data)
            }
        }

    },[]);

    useEffect(() => {
        if(!isObjectEmpty(props.validatePasswordLinkResponse)) {
            if(props.validatePasswordLinkResponse && props.validatePasswordLinkResponse.Error) {
                props.setDynamicLink();
                showErrorFlashMessage(props.validatePasswordLinkResponse.Error)
            } else {
                if(!props.validatePasswordLinkResponse.isExpired) {
                    props.navigation.navigate('ResetPassword', {
                        email: email,
                        accessCode: accessCode,
                    })
                } else {
                    props.setDynamicLink();
                    showErrorFlashMessage(props.validatePasswordLinkResponse.message)
                }
            }
        }

    },[props.validatePasswordLinkResponse]);

    useEffect(() => {
        if (StringUtils.isNotEmpty(validation) || props.isError) {
            let message = props.isError ? props.errorMessage.errorAlert : validation;
            showErrorFlashMessage(message);
            let timer = setTimeout(() => {
                setValidation('')
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [validation, props.isError]);

    useEffect(() => {
        if(props.baseUrl && StringUtils.isNotEmpty(props.baseUrl)){
            AsyncStorage.setItem(BASE_URL, props.baseUrl).then();
            global.baseUrl = props.baseUrl;
            onResetPasswordClick();
        }
    },[props.baseUrl]);

    const authenticateAccessCode = () =>{
        if(StringUtils.isEmpty(props.baseUrl)) {
            props.authenticatePanel({accessCode: accessCode});
        }
    };

    const onResetPasswordClick = () => {
        if (isValidateInput()) {
            let data = {
                emailAddress: email,
                accessCode: accessCode,
            };
            props.setUserDetails(data);
            AsyncStorage.setItem(ASYNC_RESET_CREDENTIALS, JSON.stringify(data));
            props.requestPasswordLink(data);
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

    let renderSpinnerResetButton = () => {
        return props.isLoading ?
            <View style={styles.resetPswdButton}>
                <QPSpinner spinnerColor={Colors.white}/>
            </View>
            :
            <QPButton
                testID='SignInButton'
                style={styles.resetPswdButton}
                onPress={authenticateAccessCode}
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
                            onChange={handleEmail}
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
                            onChange={handleAccessCode}
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
        dynamicLink: state.global.dynamicLink,
        validatePasswordLinkResponse: state.global.validatePasswordLinkResponse,
        baseUrl: state.global.baseUrl
    };
};
const mapDispatchToProps = dispatch => ({
    authenticatePanel : param =>{
        dispatch(authenticatePanel(param))
    },
    setUserDetails: (data) => {
        dispatch(setUserDetailsForResetPassword(data))
    },
    clearError: () => {
        dispatch(clearError(false));
    },
    requestPasswordLink: (param) => {
        dispatch(requestPasswordLink(param))
    },
    validatePasswordLink: (param) => {
        dispatch(validateResetPasswordLink(param))
    },
    setDynamicLink: () => {
        dispatch(setDynamicLink(''))
    }
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
    resetPswdButton: {
        height: MarginConstants.tab4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.accent,
        marginBottom: MarginConstants.tab2,
        marginHorizontal: MarginConstants.tab1
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
        marginVertical: MarginConstants.tab1,
        marginHorizontal: MarginConstants.tab2
    }

});
