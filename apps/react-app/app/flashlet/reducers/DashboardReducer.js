import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const dashboardData = createReducer({}, {
  [types.PULSE_DASHBOARD](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },

});

