import React from 'react';
import StringUtils from './StringUtils';
import {isStringNullOrEmpty} from './Utility';
import {validateResetPasswordLink} from '../redux/actions/login.actions';
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../api/Constant";

const getResetPasswordURLComponents = (link) => {
    const route = link.replace(/.*?:\/\//g, '');
    const path = route.match(/\/([^\/]+)\/?$/)[1];
    let components = path.replace("resetpassword?", '').split("&");
    let accessCode = components[0].split("=")[1];
    let email = components[1].split("=")[1];
    let timestamp = components[2].split("=")[1];
    return {email: email, accessCode: accessCode, timestamp: timestamp}
};

export const handleResetPasswordLink = (dynamicLink, ref, authToken, dispatch) => {
    if(StringUtils.isNotEmpty(dynamicLink)) {
        if(dynamicLink.includes('resetpassword') /*&& isStringNullOrEmpty(authToken)*/) {
            let components = getResetPasswordURLComponents(dynamicLink);
            if(ref.current?.getCurrentRoute().name === 'ForgotPassword') {
                let data = {
                    emailAddress: components.email,
                    accessCode: components.accessCode,
                    timestamp: components.timestamp.replace("+", " ")
                };
                dispatch(validateResetPasswordLink(data))
            } else {
                ref.current?.navigate('ForgotPassword', {
                    email: components.email,
                    accessCode: components.accessCode,
                    timestamp: components.timestamp
                })
            }
        }
    }
};
