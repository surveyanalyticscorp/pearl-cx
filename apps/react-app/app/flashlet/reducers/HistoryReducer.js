import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const pulseQueueHistoryList = createReducer(
    {},
    {
        [types.HISTORY_LIST](state, action) {
            if (action.data) {
                return action.data;
            }

            return state;
        }
    }
);


export const pulseQueueReport = createReducer({},{
    [types.HISTORY_REPORT](state, action) {
        if (action.data) {
            return action.data;
        }

        return state;
    }
})