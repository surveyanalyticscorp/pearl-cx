import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const panelHomeData = createReducer({}, {
  [types.COMMUNITIES_HOME](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },
});

export const panelSurveyData = createReducer({}, {
  [types.COMMUNITIES_SURVEYS] (state, action) {
    if(action.data){
      return action.data;
    }
    return state;
  }

})


