import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const locationSurveyData = createReducer({}, {
    [types.COMMUNITIES_GET_PANEL_LOCATION_SURVEY_DATA](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});