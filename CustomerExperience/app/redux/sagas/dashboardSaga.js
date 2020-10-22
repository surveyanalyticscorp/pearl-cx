import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {CX_HOME} from '../../api/Constant';
import {
  API_ERROR,
} from '../actions/index';
import {
  DASHBOARD_RECEIVED,
  GET_DASHBOARD,
} from '../actions/dashboard.actions';

export function* fetchDashboard(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_HOME,
      {'Auth-Token': action.token},
      action.param,
    );

    yield put({
      type: DASHBOARD_RECEIVED,
      response: json,
    });
  } catch (error) {
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetDashboard() {
  yield takeLatest(GET_DASHBOARD, fetchDashboard);
}
