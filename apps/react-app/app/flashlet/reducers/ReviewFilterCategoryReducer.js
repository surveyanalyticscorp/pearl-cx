import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewFilterCategories = createReducer({}, {
  [types.REVIEW_FILTER_CATEGORIES](state, action) {
    if (action.payload) {
      return action.payload;
    }
    return state;
  },

});

