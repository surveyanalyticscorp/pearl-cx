import { apiHandler } from '../../global/api/APIHandler';



export function deleteQuestion(data) {
    return dispatch => {
        return apiHandler.deleteQuestion(dispatch, data);
    };
}

