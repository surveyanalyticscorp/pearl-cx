import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewData = createReducer({}, {
  [types.REVIEW_DATA](state, action) {
    if (action.data.body.attributes) {
      return action.data.body.attributes;
    }
    return state;
  },

});

