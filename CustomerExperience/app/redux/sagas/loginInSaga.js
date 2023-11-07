import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  PANEL_AUTH_v1,
  PANEL_AUTH_v2,
  AUTH_LOGIN,
  CX_GET_RESET_PASSWORD_LINK,
  CX_VALIDATE_PASSWORD_LINK,
  AUTH_UPDATE_PASSWORD,
  ASYNC_USER_CREDENTIALS,
  CX_LOGOUT,
  CLF_LOGIN,
  CLF_GET_BASE_URL,
  ASYNC_AUTH_TOKEN,
  IS_DEV_MODE,
  CLF_BASE_URL,
  ASYNC_BEARER_TOKEN,
  ASYNC_CLF_BASE_URL,
  INIT_BASE,
  PANEL_AUTH,
  BASE_URL_MID_FIX,
} from '../../api/Constant';
import {API_ERROR, CLEAR_API_ERROR, IS_LOADING} from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';
import {
  LOGIN_RESPONSE,
  GET_LOGIN,
  VALIDATE_RESET_PASSWORD_LINK,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_RESPONSE,
  GET_RESET_PASSWORD_LINK,
  VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
  LOGOUT,
  LOGOUT_RESPONSE,
  AUTHENTICATE_PANEL,
  AUTHENTICATE_PANEL_RESPONSE,
  GET_BEARER_TOKEN,
  GET_BEARER_TOKEN_RESPONSE,
} from '../actions/login.actions';

export function* doAuthenticatePanel(action) {
  let url = INIT_BASE + PANEL_AUTH;
  try {
    const response = yield WebServiceHandler.postNew(url, {}, action.param);
    yield put({
      type: AUTHENTICATE_PANEL_RESPONSE,
      hasMidFix: false,
      response: response,
    });
  } catch (error) {
    if (error.status === 404 && !error.url.includes(BASE_URL_MID_FIX)) {
      try {
        yield put({type: CLEAR_API_ERROR, payload: {isLoading: true}});

        const response = yield WebServiceHandler.postNew(
          INIT_BASE + BASE_URL_MID_FIX + PANEL_AUTH,
          {},
          action.param,
        );

        yield put({
          type: AUTHENTICATE_PANEL_RESPONSE,
          hasMidFix: true,
          response: response,
        });
      } catch (error_) {
        console.log('Error: inner catch block', JSON.stringify(error));
        yield put({type: API_ERROR, error: error_});
      }
    } else {
      console.log('Error: first catch block', JSON.stringify(error));
      yield put({type: API_ERROR, error: error});
    }
  }
}

export function* watchAuthenticatePanel() {
  yield takeLatest(AUTHENTICATE_PANEL, doAuthenticatePanel);
}

export function* doLoginApiCall(action) {
  try {
    global.clfBaseUrl = '';
    global.bearerToken = '';
    const response = yield WebServiceHandler.postNew(
      BASE_URL_MID_FIX + AUTH_LOGIN,
      {},
      action.param,
    );

    const clfBaseUrlResponse = yield WebServiceHandler.get(
      CLF_GET_BASE_URL,
      // {Authorization: `Bearer ${clfAuthResponse.data.accessToken}`},
      {},
      {dataCenter: action.param.dataCenter},
    );
    console.log(
      'AsyncStorage base URL 1: ',
      JSON.stringify(clfBaseUrlResponse),
    );

    let userData = {
      email: action.param.emailAddress,
      password: action.param.password,
      accessCode: action.param.accessCode,
    };

    // AsyncStorage.setItem(
    //   ASYNC_CLF_BASE_URL,
    //   JSON.stringify(clfBaseUrlResponse.data.baseUrl),
    // ).then();
    // let clfBase = yield clfBaseUrlResponse.data.baseUrl;
    // global.clfBaseUrl = clfBase;
    console.log(
      'AsyncStorage base URL 2 : ',
      JSON.stringify(clfBaseUrlResponse),
    );

    yield put({
      type: LOGIN_RESPONSE,
      response: response,
      clfResponse: clfBaseUrlResponse,
    });
    AsyncStorage.setItem(ASYNC_USER_CREDENTIALS, JSON.stringify(userData));

    AsyncStorage.setItem(
      ASYNC_CLF_BASE_URL,
      JSON.stringify(
        IS_DEV_MODE ? CLF_BASE_URL : clfBaseUrlResponse.data.baseUrl,
      ),
    );
    console.log(
      'AsyncStorage base URL 3 : ',
      JSON.stringify(clfBaseUrlResponse),
    );
  } catch (error) {
    yield put({type: API_ERROR, error: error});
    yield put({
      type: AUTHENTICATE_PANEL_RESPONSE,
      response: {body: {mobileAPIURL: ''}},
    });
    global.baseUrl = '';
    global.clfBaseUrl = '';
  }
}

export function* watchDoLogin() {
  yield takeLatest(GET_LOGIN, doLoginApiCall);
}

function* fetchClfAuth(action) {
  try {
    console.log('CALL CLF LOGIN 6');

    const clfAuthResponse = yield WebServiceHandler.postNew(
      '' + action.param.clfBaseUrl + CLF_LOGIN,
      {},
      {
        emailAddress: action.param.emailAddress,
        cxUserId: action.param.userID,
        feedbackId: action.param.feedbackID,
        feedbackApiKey: action.param.feedbackApiKey,
      },
    );
    let bearerToken = clfAuthResponse.data.accessToken;

    global.bearerToken = bearerToken;
    AsyncStorage.setItem(ASYNC_BEARER_TOKEN, clfAuthResponse.data.accessToken);

    yield put({type: GET_BEARER_TOKEN_RESPONSE, response: clfAuthResponse});
  } catch (error) {
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchClfAuth() {
  yield takeLatest(GET_BEARER_TOKEN, fetchClfAuth);
}

function* getResetPasswordLink(action) {
  try {
    const response = yield WebServiceHandler.postNew(
      CX_GET_RESET_PASSWORD_LINK,
      {},
      action.param,
    );
    yield showSuccessFlashMessage(response.body.message);
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

function* doLogoutAction(action) {
  try {
    const response = yield WebServiceHandler.postNew(
      CX_LOGOUT,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({type: LOGOUT_RESPONSE, response: response});
  } catch (error) {
    // showErrorFlashMessage(error.message);
    // yield put({type: API_ERROR, error: error.message});
    yield put({type: LOGOUT_RESPONSE, response: {}});
  } finally {
    yield put({type: CLEAR_API_ERROR, payload: {isLoading: false}});
    yield put({type: LOGOUT_RESPONSE, response: {}});
  }
}

export function* watchLogout() {
  yield takeLatest(LOGOUT, doLogoutAction);
}
