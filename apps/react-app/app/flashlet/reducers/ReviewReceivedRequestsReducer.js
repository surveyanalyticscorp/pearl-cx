import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const requestsReceived = createReducer({}, {
  [types.REVIEW_RECEIVED_REQUESTS](state, action) {
    if (action.payload) {
      return action.payload;
    } else if(action.data.body.requestsReceived) {
      return action.data.body.requestsReceived;
    }
    return [];
  },

});

