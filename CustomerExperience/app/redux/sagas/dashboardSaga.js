import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {CLF_STATUS_WISE_PRIORITY_ANALYTICS, CX_HOME} from '../../api/Constant';
import {
  API_ERROR,
  IS_ERROR,
  SET_LANGUAGE_INFO,
  WANT_TO_RELOAD_DASHBOARD,
} from '../actions/index';
import {DASHBOARD_RECEIVED, GET_DASHBOARD} from '../actions/dashboard.actions';
import {showErrorFlashMessage} from '../../Utils/Utility';

export function* fetchDashboard(action) {
  try {
    console.log('SEGMENT_ID', action.segmentId);
    const json = yield WebServiceHandler.postNew(
      CX_HOME,
      {'Auth-Token': action.token},
      action.param,
    );

    const closedloopData = yield WebServiceHandler.get(
      CLF_STATUS_WISE_PRIORITY_ANALYTICS + JSON.stringify(action.segmentId),
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: DASHBOARD_RECEIVED,
      response: json,
      ticketCount: closedloopData,
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
