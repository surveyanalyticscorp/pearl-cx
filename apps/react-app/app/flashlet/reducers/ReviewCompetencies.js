import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewCompetencies = createReducer({}, {
  [types.REVIEW_COMPETENCIES](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },

});

