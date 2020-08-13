import {GET_DASHBOARD} from './index';

export const getDashboardContent = token => ({
  type: GET_DASHBOARD,
  token,
});
