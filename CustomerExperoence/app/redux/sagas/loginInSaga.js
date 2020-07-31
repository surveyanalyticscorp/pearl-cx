/* eslint-disable */
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {AUTH_LOGIN, AUTH_REQUEST_OTP, AUTH_VALIDATE_OTP, AUTH_UPDATE_PASSWORD} from '../../api/Constant';
import {
    LOGIN_RESPONSE,
    GET_LOGIN,
    API_ERROR,
    GET_FORGOT_PSWD_OTP,
    FORGOT_PSWD_OTP_RESPONSE,
    VALIDATE_USER_OTP,
    VALIDATE_USER_OTP_RESPONSE,
    UPDATE_PASSWORD,
    UPDATE_PASSWORD_RESPONSE, IS_LOADING, CLEAR_API_ERROR,
} from '../actions/index';

function* doLoginApiCall(action) {
    try {
        console.log('DD Login:' + action.param.accessCode);
        const response = yield WebServiceHandler.postNew(
            AUTH_LOGIN,
            {},
            action.param,
        );

        yield put({
            type: LOGIN_RESPONSE,
            response: response,
        });
    } catch (error) {
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchDoLogin() {
    yield takeLatest(GET_LOGIN, doLoginApiCall);
}



function* doForgotPasswordOtpApiCall(action) {
    try {
        yield put({type: CLEAR_API_ERROR, payload: {isLoading: true}});

        console.log('DD reset pswd otp:' + action.param.accessCode);
        const response = yield WebServiceHandler.postNew(
            AUTH_REQUEST_OTP,
            {},
            action.param,
        );

        yield put({
            type: FORGOT_PSWD_OTP_RESPONSE,
            response: response,
        });
    } catch (error) {
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchForgotPasswordOtp() {
    yield takeLatest(GET_FORGOT_PSWD_OTP, doForgotPasswordOtpApiCall);
}


function* validateUserOtpApiCall(action) {
    try {
        yield put({type: CLEAR_API_ERROR, payload: {isLoading: true}});

        console.log('DD Validate otp:' + action.param.accessCode);
        const response = yield WebServiceHandler.postNew(
            AUTH_VALIDATE_OTP,
            {},
            action.param,
        );

        yield put({
            type: VALIDATE_USER_OTP_RESPONSE,
            response: response,
        });
    } catch (error) {
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchValidateUserOtp() {
    yield takeLatest(VALIDATE_USER_OTP, validateUserOtpApiCall);
}




function* updatePasswordApiCall(action) {
    try {
        yield put({type: CLEAR_API_ERROR, payload: {isLoading: true}});
        console.log('DD update pswd:' + action.param.accessCode);
        const response = yield WebServiceHandler.postNew(
            AUTH_UPDATE_PASSWORD,
            {},
            action.param,
        );

        yield put({
            type: UPDATE_PASSWORD_RESPONSE,
            response: response,
        });
    } catch (error) {
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchUpdatePassword() {
    yield takeLatest(UPDATE_PASSWORD, updatePasswordApiCall);
}
