import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const praises = createReducer(
  {},
  {
    [types.PRAISE](state, action) {
      if (action.data) {
        return action.data;
      }

      return state;
    }
  }
);
