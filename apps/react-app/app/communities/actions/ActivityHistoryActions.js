import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function getActivityHistoryDetails(requestData) {

    var TIMERANGE = {
    today: "Daily" ,
    week: "Weekly" ,
    month: "Monthly",
    allTIme: "allTime"
  };

   return (dispatch, getState) => {
    if (requestData.timeRange === TIMERANGE.today) {
      return apiHandler.getPanelMemberActivityStats(dispatch, types.COMMUNITIES_ACTIVITY_HISTORY_TODAY, requestData);
    } else if (requestData.timeRange === TIMERANGE.week) {
      return apiHandler.getPanelMemberActivityStats(dispatch, types.COMMUNITIES_ACTIVITY_HISTORY_WEEK, requestData);
    } else if (requestData.timeRange === TIMERANGE.month) {
      return apiHandler.getPanelMemberActivityStats(dispatch, types.COMMUNITIES_ACTIVITY_HISTORY_MONTH, requestData);
    } else {
      return apiHandler.getPanelMemberActivityStats(dispatch, types.COMMUNITIES_ACTIVITY_HISTORY_ALLTIME, requestData);
    }
  }

}