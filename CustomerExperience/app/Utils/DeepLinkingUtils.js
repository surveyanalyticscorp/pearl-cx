import React from 'react';
import {isStringNullOrEmpty} from './Utility';
import {useSelector} from 'react-redux';
import { useNavigation, StackActions } from '@react-navigation/native';
import {setDynamicLink} from '../redux/actions';

export const navigateToUpdatePasswordScreen = (link) => {
    let authToken = useSelector(state => state.global.authToken);
    let navigation = useNavigation();
    if(isStringNullOrEmpty(authToken)) {
        const route = link.replace(/.*?:\/\//g, '');
        const path = route.match(/\/([^\/]+)\/?$/)[1];
        let components = path.replace("resetpassword?",'').split("&");
        let email = components[0].split("=")[1];
        let accessCode = components[1].split("=")[1];
        navigation.dispatch(setDynamicLink(link));
        let pushAction = StackActions.push('ResetPassword',{
            email: email,
            accessCode: accessCode
        });
        navigation.dispatch(pushAction);
    }
};


