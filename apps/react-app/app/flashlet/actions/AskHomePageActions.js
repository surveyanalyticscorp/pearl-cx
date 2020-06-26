import { apiHandler } from '../../global/api/APIHandler';

export function fetchPulseQueueHistoryList(requestData) {
    return dispatch=>{
        return apiHandler.getPulseQueueHistoryList(dispatch, requestData);
    };
}

export function fetchPulseQueueHistoryReport(requestData){
    return dispatch => {
        return apiHandler.getPulseQueueHistoryReport(dispatch,requestData);
    }
}

export function getAskedQuestionList() {
    return dispatch => {
        return apiHandler.getAskedQuestionList(dispatch);
    };
}

