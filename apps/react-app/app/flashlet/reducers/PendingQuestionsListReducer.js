import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const pendingQuestions = createReducer(
    {},
    {
        [types.PENDING_QUESTIONS](state, action) {
            if (action.data ) {
                if(action.data.body) {
                    return action.data.body;
                }
            } else {
                return {}
            }

            return state;
        }
    }
);
