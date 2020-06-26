import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function getPanelHome(requestData) {
  return (dispatch, getState) => {
     return apiHandler.getPanelHome(dispatch, requestData);
  }
}

export function getPanelSurvey(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelSurvey(dispatch, requestData);
    }
}
