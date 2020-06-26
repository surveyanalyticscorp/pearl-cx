import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const detractorTicketsNew = createReducer({}, {
    [types.CX_DETRACTOR_TICKETS_NEW](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
export const detractorTicketsPending = createReducer({}, {
    [types.CX_DETRACTOR_TICKETS_PENDING](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
export const detractorTicketsResolved = createReducer({}, {
    [types.CX_DETRACTOR_TICKETS_RESOLVED](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
