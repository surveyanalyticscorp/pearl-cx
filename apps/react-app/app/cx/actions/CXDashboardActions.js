import { apiHandler } from '../../global/api/APIHandler';

export function getCXDashboard(requestData){
    return (dispatch, getState) => {
        return apiHandler.getCXDashBoard(dispatch, requestData);
    }
}