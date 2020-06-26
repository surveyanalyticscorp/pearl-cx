import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const panelActivityDataToday = createReducer({}, {
  [types.COMMUNITIES_ACTIVITY_HISTORY_TODAY](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  } 
});
export const panelActivityDataWeek = createReducer({}, {
  [types.COMMUNITIES_ACTIVITY_HISTORY_WEEK](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  } 
});
export const panelActivityDataMonth = createReducer({}, {
  [types.COMMUNITIES_ACTIVITY_HISTORY_MONTH](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  } 
});

export const panelActivityDataAllTime = createReducer({}, {
  [types.COMMUNITIES_ACTIVITY_HISTORY_ALLTIME](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  },
});