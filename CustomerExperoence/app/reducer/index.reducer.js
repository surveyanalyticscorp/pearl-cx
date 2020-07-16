import {combineReducers} from 'redux';
import feedbackReducer from './FeedbackListReducer';

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const appReducer = combineReducers({
  feedback: feedbackReducer,
});

export default rootReducer;
