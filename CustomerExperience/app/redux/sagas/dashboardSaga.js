import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  CLF_APP_LOGIN_COUNT,
  CLF_GET_BASE_URL,
  CLF_STATUS_WISE_PRIORITY_ANALYTICS,
  CLF_WELCOME_SCREEN_COUNTS,
  CX_HOME,
  CX_WELCOME_SCREEN_DATA,
} from '../../api/Constant';
import {
  API_ERROR,
  IS_ERROR,
  IS_LOADING,
  SET_LANGUAGE_INFO,
  WANT_TO_RELOAD_DASHBOARD,
} from '../actions/index';
import {
  APP_LOGIN_COUNTER,
  DASHBOARD_RECEIVED,
  GET_CLF_BASE_URL,
  GET_DASHBOARD,
  GET_WELCOME_SCREEN_DATA,
  WELCOME_SCREEN_DATA_RECIEVED,
} from '../actions/dashboard.actions';
import {showErrorFlashMessage} from '../../Utils/Utility';
import {
  getBearerToken,
  getBearerTokenStatic,
  getClfUrl,
} from '../../Utils/ApiCallUtils';

export function* fetchDashboard(action) {
  try {
    console.log('SEGMENT_ID', action.segmentId);
    const json = yield WebServiceHandler.postNew(
      CX_HOME,
      {'Auth-Token': action.token},
      action.param,
    );

    const closedloopData = yield WebServiceHandler.get(
      getClfUrl(
        CLF_STATUS_WISE_PRIORITY_ANALYTICS + JSON.stringify(action.segmentId),
      ),
      getBearerTokenStatic(),
      action.param,
    );

    yield put({
      type: DASHBOARD_RECEIVED,
      response: json,
      ticketCount: closedloopData,
      segmentId: action.segmentId,
      npsScoreList: json.body.storeNPSList,
    });
    yield put({
      type: SET_LANGUAGE_INFO,
      payload: {languageInfo: {languageCode: json.body.languageCode}},
    });

    yield put({
      type: WANT_TO_RELOAD_DASHBOARD,
      payload: {wantToReload: false},
    });

    yield put({
      type: IS_ERROR,
      payload: {isError: false},
    });
  } catch (error) {
    showErrorFlashMessage(error.errorAlert);
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetDashboard() {
  yield takeLatest(GET_DASHBOARD, fetchDashboard);
}

export function* fetchDataCount(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});

    const clf_response = yield WebServiceHandler.get(
      getClfUrl(CLF_WELCOME_SCREEN_COUNTS),
      getBearerTokenStatic(),
      // {'Auth-Token': action.token},
      action.param,
    );

    const cx_response = yield WebServiceHandler.postNew(
      CX_WELCOME_SCREEN_DATA,
      {'Auth-Token': action.token},
      {},
    );

    console.log(
      'WELCOME_SCREEN_DATA_COUNT, clf response',
      JSON.stringify(clf_response),
    );
    yield put({
      type: WELCOME_SCREEN_DATA_RECIEVED,
      cxResponse: cx_response,
      clfResponse: clf_response,
    });

    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});

    showErrorFlashMessage(error.errorAlert);
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchDataCount() {
  yield takeLatest(GET_WELCOME_SCREEN_DATA, fetchDataCount);
}

export function* postApploginCount(action) {
  try {
    const clf_response = yield WebServiceHandler.postNew(
      '' + global.clfBaseUrl + CLF_APP_LOGIN_COUNT,
      getBearerToken(global.bearerToken),
      action.param,
    );

    console.log('CLF_APP_LOGIN_COUNT', JSON.stringify(clf_response));
  } catch (error) {
    showErrorFlashMessage(error.errorAlert);
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchApploginCount() {
  yield takeLatest(APP_LOGIN_COUNTER, postApploginCount);
}

export function* getCLFBaseURL(action) {
  try {
    const clf_response = yield WebServiceHandler.get(
      CLF_GET_BASE_URL,
      {'Auth-Token': action.token},
      action.param,
    );
  } catch (error) {
    showErrorFlashMessage(error.errorAlert);
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}
export function* watchGetCLFBaseUrl() {
  yield takeLatest(GET_CLF_BASE_URL, getCLFBaseURL);
}
