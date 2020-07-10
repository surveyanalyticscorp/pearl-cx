import {combineReducers} from 'redux';
import {feedbackList} from './FeedbackListReducer';

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const appReducer = combineReducers({
  feedbackList,
});

export default rootReducer;
