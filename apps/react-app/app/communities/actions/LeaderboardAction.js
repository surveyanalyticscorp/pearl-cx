import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function getPanelLeaderboard(requestData) {

  var TIMERANGE = {
    thisMonth: { value: 0, name: "Monthly" },
    lastMonth: { value: 1, name: "Previous Month" },
    allTime: { value: 2, name: "" }
  };

  return (dispatch, getState) => {
    if (requestData.timeRange === TIMERANGE.thisMonth.name) {
      return apiHandler.getPanelLeaderBoard(dispatch, types.COMMUNITIES_LEADERBOARD_THIS_MONTH, requestData);
    } else if (requestData.timeRange === TIMERANGE.lastMonth.name) {
      return apiHandler.getPanelLeaderBoard(dispatch, types.COMMUNITIES_LEADERBOARD_LAST_MONTH, requestData);
    } else {
      return apiHandler.getPanelLeaderBoard(dispatch, types.COMMUNITIES_LEADERBOARD_ALLTIME, requestData);
    }
  }
}