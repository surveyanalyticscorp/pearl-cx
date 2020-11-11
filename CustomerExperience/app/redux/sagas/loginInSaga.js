import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
    AUTH_LOGIN,
    CX_GET_RESET_PASSWORD_LINK,
    CX_VALIDATE_PASSWORD_LINK,
    AUTH_UPDATE_PASSWORD,
    ASYNC_USER_CREDENTIALS, CX_LOGOUT,
} from '../../api/Constant';
import {
    API_ERROR,
    CLEAR_API_ERROR,
    IS_LOADING,
} from '../actions';
import AsyncStorage from '@react-native-community/async-storage';
import {showSuccessFlashMessage} from '../../Utils/Utility';
import {LOGIN_RESPONSE,
    GET_LOGIN,
    VALIDATE_RESET_PASSWORD_LINK,
    UPDATE_PASSWORD,
    UPDATE_PASSWORD_RESPONSE,
    GET_RESET_PASSWORD_LINK,
    VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
    LOGOUT,
    LOGOUT_RESPONSE,
} from '../actions/login.actions';

export function* doLoginApiCall(action) {
    try {
        const response = yield WebServiceHandler.postNew(
            AUTH_LOGIN,
            {},
            action.param,
        );
        yield put({type: LOGIN_RESPONSE, response: response});
        let userData = {
            email: action.param.emailAddress,
            password: action.param.password,
            accessCode: action.param.accessCode
        };
        AsyncStorage.setItem(ASYNC_USER_CREDENTIALS, JSON.stringify(userData))
    } catch (error) {
        yield put({type: API_ERROR, error: error});
    }
}

export function* watchDoLogin() {
    yield takeLatest(GET_LOGIN, doLoginApiCall);
}

function* getResetPasswordLink(action) {
    try {
        const response = yield WebServiceHandler.postNew(
            CX_GET_RESET_PASSWORD_LINK,
            {},
            action.param,
        );
        yield showSuccessFlashMessage(response.body.message)

    } catch (error) {
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchForgotPasswordLink() {
    yield takeLatest(GET_RESET_PASSWORD_LINK, getResetPasswordLink);
}

function* validateResetPasswordLink(action) {
    try {
        yield put({type: IS_LOADING, payload: {isLoading: true}});
        const response = yield WebServiceHandler.postNew(
            CX_VALIDATE_PASSWORD_LINK,
            {},
            action.param,
        );

        yield put({
            type: VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
            response: response.body,
        });

    } catch (error) {
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchValidatePasswordLink() {
    yield takeLatest(VALIDATE_RESET_PASSWORD_LINK, validateResetPasswordLink);
}

function* updatePasswordApiCall(action) {
    try {
        yield put({type: CLEAR_API_ERROR, payload: {isLoading: true}});
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

function* doLogout(action) {
    try {
        const response = yield WebServiceHandler.postNew(
            CX_LOGOUT,
            {},
            action.param,
        );
        yield put({type: LOGOUT_RESPONSE, response: response});
    } catch (error) {
        yield put({type: API_ERROR, error: error});
    }
}

export function* watchLogout() {
    yield takeLatest(LOGOUT, doLogout)
}
