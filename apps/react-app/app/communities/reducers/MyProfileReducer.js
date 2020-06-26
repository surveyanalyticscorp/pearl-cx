import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const panelProfileData = createReducer({}, {
  [types.COMMUNITIES_PROFILE](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },
});

export const rewardsData = createReducer({}, {
    [types.COMMUNITIES_REWARDS] (state, action){
        if(action.data){
            return action.data;
        }
        return state;
    }
});