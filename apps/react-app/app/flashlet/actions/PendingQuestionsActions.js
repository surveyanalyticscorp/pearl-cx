import { apiHandler } from '../../global/api/APIHandler';


export function getPendingQuestionList() {
    return dispatch => {
        return apiHandler.getPendingQuestionsList(dispatch);
    };
}

