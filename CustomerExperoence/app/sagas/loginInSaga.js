import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {LOGIN_RESPONSE, GET_LOGIN, API_ERROR} from '../actions';

function* doLoginAsync(action) {
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
  yield takeLatest(GET_LOGIN, doLoginAsync);
}
