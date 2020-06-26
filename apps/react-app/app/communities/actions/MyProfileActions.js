import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function getProfileDetails(requestData) {
  return (dispatch, getState) => {
     return apiHandler.getProfileDetails(dispatch, requestData);
  }
}
export function updateProfileDetails(requestData){
  return (dispatch, getState) => {
     return apiHandler.updatePanelMemberDetails(dispatch, requestData);
  }
}
export function getRewards(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getRewards(dispatch, requestData);
    }
}

export function redeemReward(requestData) {
    return (dispatch, getState) => {
        return apiHandler.redeemRewards(dispatch,requestData);
    }
}