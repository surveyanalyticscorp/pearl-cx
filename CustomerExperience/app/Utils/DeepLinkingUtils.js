import React from 'react';

export const getResetPasswordURLComponents = (link) => {
    const route = link.replace(/.*?:\/\//g, '');
    const path = route.match(/\/([^\/]+)\/?$/)[1];
    let components = path.replace("resetpassword?", '').split("&");
    let accessCode = components[0].split("=")[1];
    let email = components[1].split("=")[1];
    return {email: email, accessCode: accessCode}
};
