import {
  PANEL_MEMBER_RECEIVED,
  SURVEY_RESPONSE_DETAILS_RECEIVED,
} from '../actions/feedback.actions';

const initialState = {
  panelMember: {},
  surveyDetails: {},
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case PANEL_MEMBER_RECEIVED: {
      return {
        ...state,
        panelMember: action.response.body,
      };
    }
    case SURVEY_RESPONSE_DETAILS_RECEIVED: {
      return {
        ...state,
        surveyDetails: action.response.body,
      };
    }
    default: {
      return state;
    }
  }
};

export default feedbackReducer;
