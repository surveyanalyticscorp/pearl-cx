import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {LOGIN_RESPONSE, GET_LOGIN} from '../actions';

function* doLoginAsync(action) {
  try {
    console.log('DD Login:' + action.param.accessCode);
    const json = yield WebServiceHandler.post(
      BASE_URL + 'a/nativehtml/cx.auth.CXLogin',
      {},
      action.param,
    );

    yield put({
      type: LOGIN_RESPONSE,
      response: json,
    });
  } catch (error) {
    console.log(error);
  }
}

export function* watchDoLogin() {
  console.log('DD watchDoLogin');
  yield takeLatest(GET_LOGIN, doLoginAsync);
}
