import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function callApiForPanelMemberSurvey(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelMemberSurvey(dispatch, requestData);
    }
}

export function getPanelSurvey(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelSurvey(dispatch, requestData);
    }
}
