import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewCategories = createReducer({}, {
  [types.REVIEW_CATEGORIES](state, action) {
    if (action.data.body.competencies) {
      return action.data.body.competencies;
    }
    return state;
  },

});

