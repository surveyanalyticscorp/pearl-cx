import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const orgViewData = createReducer({}, {
    [types.PULSE_ORG_VIEW](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },

});

