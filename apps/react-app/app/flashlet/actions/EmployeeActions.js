import * as types from '../../global/api/types';

export function setEmployeeInfo(employeeData) {
  return (dispatch) => {
    dispatch({ type: types.EMPLOYEE_INFO, data: employeeData });
  };
}
