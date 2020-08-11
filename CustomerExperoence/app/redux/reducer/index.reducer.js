import {combineReducers} from 'redux';
import feedbackReducer from './FeedbackListReducer';
import dashboardReducer from './DashboardReducer';
import globalReducer from './GlobalReducer';
import {CLEAR_USER_INFO} from '../actions';
const rootReducer = (state, action) => {
  if (action.type === CLEAR_USER_INFO) {
    state = undefined;
  }
  return appReducer(state, action);
};

const appReducer = combineReducers({
  feedback: feedbackReducer,
  dashboard: dashboardReducer,
  global: globalReducer,
});

export default rootReducer;
