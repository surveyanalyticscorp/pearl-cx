import { apiHandler } from '../../global/api/APIHandler';



export function submitQuestion(data) {
    return dispatch => {
        return apiHandler.submitQuestion(dispatch, data);
    };
}

