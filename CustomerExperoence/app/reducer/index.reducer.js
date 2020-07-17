import {combineReducers} from 'redux';
import feedbackReducer from './FeedbackListReducer';
import dashboardReducer from './DashboardReducer';

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const appReducer = combineReducers({
  feedback: feedbackReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
