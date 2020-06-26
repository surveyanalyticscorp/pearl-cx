import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewMyReviewsReceived = createReducer({}, {
  [types.REVIEW_MYREVIEWS_RECEIVED](state, action) {
    if (action.payload) {
      return action.payload;
    } else if(action.data.body.myReviewReceived) {
      return action.data.body.myReviewReceived;
    }
    return [];
  },

});

