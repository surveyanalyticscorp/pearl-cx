/**
 * Created by TanviGupta on 05/02/20.
 */
import createReducer from "../../global/reducerLib/createReducer";
import * as types from "../../global/api/types";

export const panelDocumentsData = createReducer({body: {}}, {
    [types.COMMUNITIES_PANEL_MEMBER_DOCUMENTS](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
