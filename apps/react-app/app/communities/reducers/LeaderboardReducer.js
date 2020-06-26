import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const leaderboardThisMonthData = createReducer({}, {
  [types.COMMUNITIES_LEADERBOARD_THIS_MONTH](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  } 
});
export const leaderboardLastMonthData = createReducer({}, {
  [types.COMMUNITIES_LEADERBOARD_LAST_MONTH](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  } 
});
export const leaderboardAllTimeData = createReducer({}, {
  [types.COMMUNITIES_LEADERBOARD_ALLTIME](state, action) {
    if (action.data) {
      return action.data;
    }
    return state;
  } 
});