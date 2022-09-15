import {DMYFORMAT} from './AppConstants';
import moment from 'moment';

export const getSelectedRange = (range) => {
  let today = new Date();
  let month = today.getMonth() + 1;
  let tempEndDate = today.getDate() + '/' + month + '/' + today.getFullYear();
  switch (range.type) {
    case 1:
      /** Last 30 days*/
      let tempStartDate = moment(tempEndDate, DMYFORMAT)
        .subtract(30, 'days')
        .format(DMYFORMAT);
      return {startDate: tempStartDate, endDate: tempEndDate};
    case 2:
      /** This month*/
      let firstDate = 1 + '/' + month + '/' + today.getFullYear();
      tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
      return {startDate: tempStartDate, endDate: tempEndDate};
    case 3:
      /** Last month*/
      firstDate = 1 + '/' + today.getMonth() + '/' + today.getFullYear();
      tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
      let lastDate = new Date(today.getFullYear(), today.getMonth(), 0);
      month = lastDate.getMonth() + 1;
      tempEndDate =
        lastDate.getDate() + '/' + month + '/' + lastDate.getFullYear();
      tempEndDate = moment(tempEndDate, DMYFORMAT).format(DMYFORMAT);
      return {startDate: tempStartDate, endDate: tempEndDate};
    case 4:
      /** Last 3 months*/
      tempStartDate = moment(tempEndDate, DMYFORMAT)
        .subtract(3, 'months')
        .format(DMYFORMAT);
      return {startDate: tempStartDate, endDate: tempEndDate};
    case 5:
      /** Last 6 months */
      tempStartDate = moment(tempEndDate, DMYFORMAT)
        .subtract(6, 'months')
        .format(DMYFORMAT);
      return {startDate: tempStartDate, endDate: tempEndDate};
    default:
      /** Custom */
      return {startDate: range.startDate, endDate: range.endDate};
  }
};
