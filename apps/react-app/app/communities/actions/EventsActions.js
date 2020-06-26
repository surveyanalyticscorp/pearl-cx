import { apiHandler } from '../../global/api/APIHandler';

export function callApiForPanelEvents(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelEvents(dispatch, requestData);
    }
}
