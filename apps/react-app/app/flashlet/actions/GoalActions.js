'use strict';

import { apiHandler } from '../../global/api/APIHandler';
import goals from './Goals';

export function fetchGoals(requestData) {
  // const goals = require('./Goals');

  return dispatch => {
    dispatch({
      type: 'GOALS_N_OBJECTIVES',
      data: goals
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

export function updateGoalsNObjevtives(data) {
  return dispatch => {
    dispatch({
      type: 'GOALS_N_OBJECTIVES',
      data
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

export function newGoal(isNewGoal) {
  return dispatch => {
    dispatch({
      type: 'GOALS_NEW_OBJECTIVE',
      data: { add: isNewGoal }
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}
