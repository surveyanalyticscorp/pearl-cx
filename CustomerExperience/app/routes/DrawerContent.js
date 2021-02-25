import React, {useEffect, useState} from 'react';
import {
    View,
    Image,
    StyleSheet,
    ImageBackground,
    TouchableWithoutFeedback,
    Text, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../styles/color.constants';
import AsyncStorage from '@react-native-community/async-storage';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import {clearUserInfo} from '../redux/actions';
import {doLogout} from '../redux/actions/login.actions';
import {connect} from 'react-redux';
import {ASYNC_PUSH_TOKEN, ASYNC_USER_CREDENTIALS, BASE_URL} from '../api/Constant';
import {Sizes} from '../styles/Size.constant';
import {PaddingConstants} from '../styles/padding.constants';
import StringUtils from '../Utils/StringUtils';
import DeviceInfo from 'react-native-device-info';
import {isObjectEmpty, isStringNullOrEmpty} from '../Utils/Utility';
import messaging from '@react-native-firebase/messaging';
import {DrawerActions} from '@react-navigation/native';
import QPSpinner from '../widgets/QPSpinner';
import {Notifications} from "react-native-notifications";

const DrawerContent = props => {
    const [userCredentials, setUserCredentials] = useState('');
    const [logoutAlert, setLogoutAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(ASYNC_USER_CREDENTIALS).then((value) => {
            setUserCredentials(JSON.parse(value));
        })
    }, []);

    useEffect(() => {
        if(!isObjectEmpty(props.logoutResponse)) {
            if(props.logoutResponse.statusCode === 200) {
                AsyncStorage.clear().then(() => {
                    props.clearUserData();
                    setLogoutAlert(false);
                    setLoading(false);
                });
            }
        }
    },[props.logoutResponse]);


    const renderDrawerButtons = () => {
        return (
            <View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        props.navigation.navigate('Dashboard');
                    }}>
                    <View style={styles.drawerRow}>
                        <Icon size={1.3*Sizes.icons} color={Colors.accent} name={'dashboard'} style={styles.rowIcon}/>
                        <Text style={styles.labelStyle}>Dashboard</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        props.navigation.navigate('Responses');
                    }}>
                    <View style={styles.drawerRow}>
                        <Icon size={1.3*Sizes.icons} color={Colors.accent} name={'feedback'} style={styles.rowIcon}/>
                        <Text style={styles.labelStyle}>Responses</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        props.navigation.navigate('Settings');
                    }}>
                    <View style={styles.drawerRow}>
                        <Icon size={1.3*Sizes.icons} color={Colors.accent} name={'settings'} style={styles.rowIcon}/>
                        <Text style={styles.labelStyle}>Settings</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        props.navigation.dispatch(DrawerActions.toggleDrawer());
                        !logoutAlert && setLogoutAlert(true);
                    }}>
                    <View style={styles.drawerRow}>
                        <FontIcon size={1.3*Sizes.icons} color={Colors.accent} name={'sign-out-alt'} style={styles.rowIcon}/>
                        <Text style={styles.labelStyle}>Logout</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    const renderDialog = () => {
        return (
            Alert.alert(
                'Are you sure you want to logout?',
                '',
                [
                    {
                        text: 'Yes',
                        onPress: logoutAction
                    },
                    {   text: 'No',
                        onPress: () => {
                            setLogoutAlert(false)
                        }
                    }
                ],
                { cancelable: false }
            )
        );
    };

    let renderSpinner = () => {
        if(loading) {
            return (
                <View style={styles.loading}>
                    <QPSpinner />
                </View>
            )
        }
    };

    let logoutAction = () => {

        AsyncStorage.multiGet([ASYNC_PUSH_TOKEN, ASYNC_USER_CREDENTIALS]).then(response => {
            let token = response[0][1];
            let userDetails = response[1][1];
            if(!isStringNullOrEmpty(token)) {
                callLogoutAPI(userDetails, token)
            } else {
                messaging()
                    .getToken()
                    .then(token => {
                        callLogoutAPI(userDetails, token)
                    });
            }
        });
    };

    let callLogoutAPI = (user, token) => {
        let userDetails = JSON.parse(user);
        let params = {
            "accessCode": userDetails.accessCode,
            "emailAddress": userDetails.email,
            "pushToken": token,
            "udid": DeviceInfo.getUniqueId(),
        };
        props.logoutUser(props.authToken, params);
        setLoading(true);
        Notifications.removeAllDeliveredNotifications();
        AsyncStorage.setItem(BASE_URL, '').then(()=>{
            global.baseUrl = ''
        });
    };

    let renderAppVersion = () => {
        return (
            <View style={styles.drawerVersionContainer}>
                <Text style={styles.drawerVersionText}> {"v " + DeviceInfo.getVersion()} </Text>
            </View>
        )
    };

    let username = props.userInfo.firstName + ' '+ props.userInfo.lastName;
    let titleText = StringUtils.isNotEmpty(username) ? username : userCredentials ? userCredentials.email : '';

    return (
        <View style={styles.container}>
            <ImageBackground
                resizeMode={'cover'}
                source={require('../config/images/drawerBanner.png')}
                style={styles.imageBackgroundContainer}>
                <View style={{flex: 1}}>
                    <Image
                        style={styles.image}
                        source={require('../config/images/cx-logo.png')}
                        resizeMode='contain'
                    />
                    <View style={{marginTop: MarginConstants.halfTab}}>
                        <Text style={styles.emailCaption}>{titleText}</Text>
                    </View>
                    {renderDrawerButtons()}
                    {renderAppVersion()}
                </View>
                {!loading && logoutAlert && renderDialog()}
                {loading && renderSpinner()}
            </ImageBackground>
        </View>
    );
};

const mapStateToProps = state => {
    return {
        userInfo: state.global.userInfo,
        logoutResponse: state.global.logoutResponse,
        authToken: state.global.authToken,
    };
};

const mapDispatchToProps = dispatch => ({
    logoutUser: (token, params) => {
        dispatch(doLogout(token, params))
    },
    clearUserData: () => {
        dispatch(clearUserInfo());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        elevation: 5,
        zIndex: 100,
        backgroundColor: Colors.transparent,
    },
    imageBackgroundContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image:{
        marginTop: MarginConstants.tab4,
        width: MarginConstants.tab4 * 6,
        height: MarginConstants.tab4 * 4,
    },
    labelStyle: {
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.primary,
        color: Colors.primary,
        paddingLeft: PaddingConstants.tab1
    },
    emailCaption: {
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.secondary,
        color: Colors.primary,
        textAlign: 'center'
    },
    drawerRow: {
        flexDirection: 'row',
        marginTop: MarginConstants.tab2,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    rowIcon: {
        margin: MarginConstants.tab1
    },
    drawerVersionContainer: {
        flex:1,
        justifyContent:'flex-end',
    },
    drawerVersionText: {
        margin: MarginConstants.tab1,
        color: Colors.primary,
        fontSize: TextSizes.primary,
        textAlign: 'left'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
