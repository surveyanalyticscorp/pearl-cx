import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewEmployeeListNetwork = createReducer({}, {
  [types.REVIEW_EMPLOYEE_NETWORK](state, action) {

    if(action.payload) {
      return action.payload;
    }
    if (action.data.body.memberCustomFields) {
      return action.data.body.memberCustomFields;
    }
    return state;
  },

});

