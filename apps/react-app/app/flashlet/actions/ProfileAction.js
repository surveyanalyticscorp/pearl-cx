import * as types from './types'
import { apiHandler } from '../../global/api/APIHandler';

export function fetchEmployeeProfileData(requestData) {
  return (dispatch, getState) => {
    return apiHandler.getFlashLetMemberProfile(dispatch, requestData);
  }
}
export function updateProfileData(requestData) {
  return (dispatch, getState) => {
    return apiHandler.updateFlashLetMemberProfile(dispatch, requestData);
  }
}


