import * as types from './types';
import orgChartData from './OrgChartData';
import { apiHandler } from '../../global/api/APIHandler';

export function fetchOrgViewData() {
  return (dispatch, getState) => {
    return apiHandler.getFlashletOrgViewData(dispatch);
  }

//  TODO: And remove this
//   return dispatch => {
//     dispatch({
//       type: 'PULSE_ORG_VIEW',
//       data: orgChartData
//     });
//   };
}
