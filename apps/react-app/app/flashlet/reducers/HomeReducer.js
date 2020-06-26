import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const pulseData = createReducer(
  {},
  {
    [types.GET_PULSE](state, action) {
      if (action.data) {
        return sortFieldsData(action.data);
      }
      return state;
    },
    [types.PULSE_RESPONSE_COLLECT](state, action) {
      if (action.data) {
        return sortFieldsData(action.data);
      }
      return state;
    }
  }
);

function sortFieldsData(data) {
  if (data.body.selectedBatch.hasResult && data.body.selectedBatch.result.employeeFieldResults) {
    data.body.selectedBatch.result.employeeFieldResults.forEach(function(element) {
      element.choiceAnalytics = element.choiceAnalytics.sort((f1, f2) => {
        return f2.positivePercent - f1.positivePercent;
      });
      element.choiceAnalytics = element.choiceAnalytics.move(
        getIndexOfUnassigned(element.choiceAnalytics),
        element.choiceAnalytics.length - 1
      );
    }, this);
  }
  return data;
}

Array.prototype.move = function(from, to) {
  if (from !== -1) this.splice(to, 0, this.splice(from, 1)[0]);
  return this;
};

function getIndexOfUnassigned(data) {
  for (i = 0; i < data.length; i++) {
    if (data[i].name === 'Unassigned' || data[i].name === 'unassigned') {
      //console.log("Returning- " + i);
      return i;
    }
  }
  return -1;
}
