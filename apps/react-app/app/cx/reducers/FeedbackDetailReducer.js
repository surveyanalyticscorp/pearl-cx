import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const selectedFeedback = createReducer(
    {},
    {
        [types.CX_FEEDBACK_SELECTED](state, action) {
            if (action.data) {
                return action.data;
            }

            return state;
        },
        [types.CX_FEEDBACK_UPDATED](state, action) {
            if (action.data) {
                return action.data.body.updatedTicket

            }

            return state;
        }
    }
);
