import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {
  LOGIN_RESPONSE,
  GET_LOGIN,
  API_ERROR,
  GET_FORGOT_PSWD_OTP,
  FORGOT_PSWD_OTP_RESPONSE,
  VALIDATE_USER_OTP,
  VALIDATE_USER_OTP_RESPONSE,
} from '../actions';

function* doLoginApiCall(action) {
  try {
    console.log('DD Login:' + action.param.accessCode);
    const response = yield WebServiceHandler.postNew(
      BASE_URL + 'a/nativehtml/cx.auth.CXLogin',
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
    console.log('DD reset pswd otp:' + action.param.accessCode);
    const response = yield WebServiceHandler.postNew(
      BASE_URL + 'a/nativehtml/cx.auth.CXForgotPasswordOTP',
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
    console.log('DD Validate otp:' + action.param.accessCode);
    const response = yield WebServiceHandler.postNew(
      BASE_URL + 'a/nativehtml/cx.auth.ValidateCXUserOTP',
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
