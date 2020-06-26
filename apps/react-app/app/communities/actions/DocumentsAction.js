import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function callApiForPanelMemberDocuments(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getMemberDocuments(dispatch, requestData);
    }
}

export function updatePanelMemberDocuments(requestData) {
    return (dispatch, getState) => {
        return apiHandler.postUpdateMemberDocuments(dispatch, requestData);
    }
}

export function updatePanelMemberReadDocuments(requestData) {
    return (dispatch, getState) => {
        return apiHandler.postUpdateMemberReadDocuments(dispatch, requestData);
    }
}
