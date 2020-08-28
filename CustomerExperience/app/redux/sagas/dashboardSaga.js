import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {CX_HOME, CX_DETRACTOR_TICKETS} from '../../api/Constant';
import {
  API_ERROR,
  IS_LOADING,
} from '../actions/index';
import {
  DASHBOARD_RECEIVED,
  DETRACTOR_TICKET_RECEIVED,
  GET_DASHBOARD,
  GET_DETRACTOR_TICKET,
} from '../actions/dashboard.actions';

export function* fetchDashboard(action) {
  try {
    const json = yield WebServiceHandler.postNew(
      CX_HOME,
      {'Auth-Token': action.token},
      {},
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

function* fetchDetractorTicket(action) {
  try {
    yield put({type: IS_LOADING, payload: {isLoading: true}});
    const json = yield WebServiceHandler.postNew(
      CX_DETRACTOR_TICKETS,
      {'Auth-Token': action.token},
      action.param,
    );
    yield put({
      type: DETRACTOR_TICKET_RECEIVED,
      response: json,
    });
    yield put({type: IS_LOADING, payload: {isLoading: false}});
  } catch (error) {
    yield put({type: IS_LOADING, payload: {isLoading: false}});
    yield put({
      type: API_ERROR,
      error: error,
    });
  }
}

export function* watchGetDetractorTicket() {
  yield takeLatest(GET_DETRACTOR_TICKET, fetchDetractorTicket);
}
