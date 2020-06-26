import * as types from './types'
import { apiHandler } from '../../global/api/APIHandler';

export function fetchDashboardData() {
  return (dispatch, getState) => {
     return apiHandler.getFlashletPulseDashboard(dispatch);
  }
}

