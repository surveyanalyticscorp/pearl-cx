import * as types from './types'
import { apiHandler } from '../../global/api/APIHandler';

export function getPulseData(requestData) {
  return (dispatch, getState) => {
     return apiHandler.getFlashLetPulse(dispatch, requestData);
  }
}
export function submitPulseResponse(requestData) {
  return (dispatch, getState) => {
     return apiHandler.submitFlashletPulseResponse(dispatch, requestData);
  }
}


