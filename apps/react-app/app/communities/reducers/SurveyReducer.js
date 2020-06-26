import createReducer from "../../global/reducerLib/createReducer";
import * as types from "../../global/api/types";

export const panelSurveyTabData = createReducer({body: {}}, {
    [types.COMMUNITIES_PANEL_MEMBER_SURVEYS](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
