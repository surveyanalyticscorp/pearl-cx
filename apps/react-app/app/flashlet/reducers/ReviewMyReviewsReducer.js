import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewMyReviews = createReducer({}, {
  [types.REVIEW_MYREVIEWS](state, action) {
    if (action.payload) {
      return action.payload;
    } else if(action.data.body.myReview) {
      return action.data.body.myReview;
    }
    return [];
  },

});

