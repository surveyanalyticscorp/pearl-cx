import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const cxDashboardData = createReducer({}, {
    [types.CX_DASHBOARD](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
