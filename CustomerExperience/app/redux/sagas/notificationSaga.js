import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from "../../api/WebServiceHandler";
import {CX_GET_NOTIFICATION_LIST} from "../../api/Constant";
import {GET_NOTIFICATION, NOTIFICATION_RECEIVED} from "../actions/notification.actions";


function* fetchNotifications(action) {
    try {
        const json = yield WebServiceHandler.postNew(
            CX_GET_NOTIFICATION_LIST,
            {'Auth-Token': action.token},
            {},
        );

        yield put({
            type: NOTIFICATION_RECEIVED,
            response: json,
        });
    } catch (error) {

    }
}

export function* watchGetNotification() {
    yield takeLatest(GET_NOTIFICATION, fetchNotifications)
}
