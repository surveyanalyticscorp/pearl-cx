import { apiHandler } from '../../global/api/APIHandler';
export function getLocationSurveyData(requestData){
    return (dispatch, getState) => {
        return apiHandler.getPanelLocationSurveyData(dispatch, requestData);
    }
}