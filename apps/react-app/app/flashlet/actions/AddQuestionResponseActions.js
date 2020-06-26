import { apiHandler } from '../../global/api/APIHandler';



export function addQuestionResponse(data) {
    return dispatch => {
        return apiHandler.addQuestionResponse(dispatch, data);
    };
}

