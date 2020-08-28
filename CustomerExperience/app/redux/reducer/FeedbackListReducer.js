import {FEEDBACK_RECEIVED, FEEDBACK_UPDATED, SET_FEEDBACK_RANGE_FILTER} from '../actions/feedback.actions';

const initialState = {
  response: {},
  updateResponse: {},
  range:{}
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEEDBACK_RECEIVED: {
      return {
        ...state,
        response: action.response.body,
      };
    }
    case FEEDBACK_UPDATED: {
      return {
        ...state,
        updateResponse: action.response,
      };
    }
    case SET_FEEDBACK_RANGE_FILTER: {
      return {
        ...state,
        range: action.range,
      };
    }
    default: {
      return state;
    }
  }
};
export default feedbackReducer;
