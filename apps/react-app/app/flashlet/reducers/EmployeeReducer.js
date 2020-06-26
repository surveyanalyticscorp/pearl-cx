import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const employeeInfo = createReducer({}, {
  [types.EMPLOYEE_INFO](state, action) {
    if (action.data) {
      return action.data;
    }

    return state;
  }
});

