import {FEEDBACK_UPDATED} from '../actions';

const initialState = {
  response: {},
};

const updateFeedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEEDBACK_UPDATED: {
      return {
        ...state,
        response: action.response,
      };
    }
    default: {
      return state;
    }
  }
};
export default updateFeedbackReducer;
