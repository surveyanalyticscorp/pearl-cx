import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const reviewInfo = createReducer({}, {
  [types.REVIEW_INFO](state, action) {
    if (action.data.body.reviewInfo) {
      return action.data.body.reviewInfo;
    }

    return state;
  }
});

