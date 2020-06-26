import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewMyRequests = createReducer({}, {
  [types.REVIEW_MYREQUESTS](state, action) {
    if (action.payload) {
      return action.payload;
    } else if(action.data.body.myRequests) {
      return action.data.body.myRequests;
    }
    return [];
  },

});

