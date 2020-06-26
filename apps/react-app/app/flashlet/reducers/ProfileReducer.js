import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const profileData = createReducer({}, {
  [types.PULSE_PROFILE](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },

});
