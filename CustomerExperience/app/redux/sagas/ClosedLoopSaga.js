import {API_ERROR, IS_LOADING} from '../actions';
import {takeLatest, put} from 'redux-saga/effects';
import WebServiceHandler from '../../api/WebServiceHandler';
import {
    CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
    CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
    CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
    GET_CLOSED_LOOP_OWNER_DETAILS,
    GET_CLOSED_LOOP_SEGMENT_DETAILS,
    GET_CLOSED_LOOP_TICKET_DETAILS,
} from '../actions/dashboard.actions';
import {
    CX_GET_CLOSED_LOOP_OWNER_DETAILS,
    CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
    CX_GET_CLOSED_LOOP_TICKET_DETAILS,
} from '../../api/Constant';

function* fetchDetractorTicketDetails(action) {
    try {
        yield put({type: IS_LOADING, payload: {isLoading: true}});
        const json = yield WebServiceHandler.postNew(
            CX_GET_CLOSED_LOOP_TICKET_DETAILS,
            {'Auth-Token': action.token},
            action.param,
        );
        yield put({
            type: CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
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

export function* watchGetDetractorTicketDetail() {
    yield takeLatest(GET_CLOSED_LOOP_TICKET_DETAILS, fetchDetractorTicketDetails);
}

function* fetchClosedLoopSegmentDetails(action) {
    try {
        const json = yield WebServiceHandler.postNew(
            CX_GET_CLOSED_LOOP_SEGMENT_DETAILS,
            {'Auth-Token': action.token},
            action.param,
        );
        yield put({
            type: CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
            response: json,
        });
    } catch (error) {
        yield put({type: IS_LOADING, payload: {isLoading: false}});
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchGetClosedLoopSegmentDetails() {
    yield takeLatest(GET_CLOSED_LOOP_SEGMENT_DETAILS, fetchClosedLoopSegmentDetails);
}

function* fetchClosedLoopOwnerDetails(action) {
    try {
        const json = yield WebServiceHandler.postNew(
            CX_GET_CLOSED_LOOP_OWNER_DETAILS,
            {'Auth-Token': action.token},
            action.param,
        );
        yield put({
            type: CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
            response: json,
        });
    } catch (error) {
        yield put({type: IS_LOADING, payload: {isLoading: false}});
        yield put({
            type: API_ERROR,
            error: error,
        });
    }
}

export function* watchGetClosedLoopOwnerDetails() {
    yield takeLatest(GET_CLOSED_LOOP_OWNER_DETAILS, fetchClosedLoopOwnerDetails);
}

