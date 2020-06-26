import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewNetworks = createReducer({}, {
  [types.REVIEW_NETWORKS](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },

});

