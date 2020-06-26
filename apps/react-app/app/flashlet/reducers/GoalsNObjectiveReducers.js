import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const goalsnobjectives = createReducer(
  {},
  {
    [types.GOALS_N_OBJECTIVES](state, action) {
      if (action.data) {
        return action.data;
      }

      return state;
    }
  }
);
