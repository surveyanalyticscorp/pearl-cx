import {FEEDBACK_RECEIVED} from '../actions';

const initialState = {
  response: {},
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEEDBACK_RECEIVED: {
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
export default feedbackReducer;
