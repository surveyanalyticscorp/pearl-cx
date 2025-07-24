import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
  CLF_GET_NOTIFICATIONS,
  CLF_PATCH_READ_NOTIFCATION,
  NOTIFICATIONS_PER_PAGE,
} from '../../api/Constant';
import {
  GET_NOTIFICATION,
  NOTIFICATION_RECEIVED,
  READ_NOTIFICATION,
  READ_NOTIFICATION_RECIEVED,
} from '../actions/notification.actions';
import {getBearerTokenStatic, getClfUrl} from '../../Utils/ApiCallUtils';

function* fetchNotifications(action) {
  const url = getClfUrl(CLF_GET_NOTIFICATIONS + action.userId);

  try {
    // const json = yield WebServiceHandler.postNew(
    //     CX_GET_NOTIFICATION_LIST,
    //     {'Auth-Token': action.token},
    //     {},
    // );

    const response = yield WebServiceHandler.get(url, getBearerTokenStatic(), {
      notificationStatus: 'all',
      perPage: NOTIFICATIONS_PER_PAGE,
      pageNumber: 1,
    });
    if (response?.status === 'success') {
      yield put({
        type: NOTIFICATION_RECEIVED,
        response: response?.data,
      });
    }
  } catch (error) {
    console.log('NOTIFICATION LOGS ERROR', url, JSON.stringify(error));
  }
}

export function* watchGetNotification() {
  yield takeLatest(GET_NOTIFICATION, fetchNotifications);
}

function* readNotifiaction(action) {
  const url = getClfUrl(CLF_PATCH_READ_NOTIFCATION + action.notificationId);

  try {
    const response = yield WebServiceHandler.patch(
      url,
      getBearerTokenStatic(),
      {},
    );

    if (response?.status === 'success') {
      yield put({
        type: READ_NOTIFICATION_RECIEVED,
        payload: response,
      });
    }
  } catch (error) {
    console.log('NOTIFICATION LOGS ERROR', url, JSON.stringify(error));
  }
}

export function* watchReadNotification() {
  yield takeLatest(READ_NOTIFICATION, readNotifiaction);
}
