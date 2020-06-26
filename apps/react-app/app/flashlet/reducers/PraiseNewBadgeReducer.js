import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

const initialState = { selectedBadge: null, add: false };

export const praiseNewBadge = createReducer(
  {},
  {
    [types.PRAISE_NEW_BADGE](state = initialState, action) {
      if (action.data) {
        return action.data;
      }

      return state;
    }
  }
);
