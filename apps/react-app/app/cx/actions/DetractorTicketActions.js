import { apiHandler } from '../../global/api/APIHandler';

export function getDetractorTickets(requestData){
    return (dispatch, getState) => {
        return apiHandler.getDetractorTickets(dispatch, requestData);
    }
}