import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const userBadges = createReducer(
  {},
  {
    [types.USER_BADGES](state, action) {
      if (action.data) {
        return action.data;
      }

      return state;
    }
  }
);
