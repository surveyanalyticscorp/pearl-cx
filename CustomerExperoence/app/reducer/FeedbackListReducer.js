import {FEEDBACK_RECEIVED, FEEDBACK_UPDATED} from '../actions';

const initialState = {
  response: {},
  updateResponse: {},
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEEDBACK_RECEIVED: {
      return {
        ...state,
        response: action.response,
      };
    }
    case FEEDBACK_UPDATED: {
      return {
        ...state,
        updateResponse: action.response,
      };
    }
    default: {
      return state;
    }
  }
};
export default feedbackReducer;
