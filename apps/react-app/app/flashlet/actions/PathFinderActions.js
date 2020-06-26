import { apiHandler } from '../../global/api/APIHandler';


export function getFlashLetPathFinder() {
    return dispatch => {
        return apiHandler.getFlashLetPathFinder(dispatch);
    };
}

export function getFlashLetPathFinderResults(){
    return dispatch => {
        return apiHandler.getFlashLetPathFinderResults(dispatch);
    }
}
export function submitPathFinderResponse(response) {
    return dispatch => {
        return apiHandler.submitPathFinderResponse(dispatch, response);
    };
}

