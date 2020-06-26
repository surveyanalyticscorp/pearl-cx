import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';
const initalState = { add: false };

export const newGoal = createReducer(
  {},
  {
    [types.GOALS_NEW_OBJECTIVE](state = initalState, action) {
      if (action.data) {
        return action.data;
      }

      return state;
    }
  }
);
