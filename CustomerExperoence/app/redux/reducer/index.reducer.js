import {combineReducers} from 'redux';
import feedbackReducer from './FeedbackListReducer';
import dashboardReducer from './DashboardReducer';
import globalReducer from './GlobalReducer';
const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const appReducer = combineReducers({
  feedback: feedbackReducer,
  dashboard: dashboardReducer,
  global: globalReducer,
});

export default rootReducer;
