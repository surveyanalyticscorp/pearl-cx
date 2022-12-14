import {combineReducers} from 'redux';
import dashboardReducer from './DashboardReducer';
import globalReducer from './GlobalReducer';
import notificationReducer from './NotificationReducer';
import {CLEAR_USER_INFO} from '../actions';
import {NetworkReducer} from 'react-native-redux-connectivity';
import feedbackReducer from './FeedbackReducer';

const rootReducer = (state, action) => {
  if (action.type === CLEAR_USER_INFO) {
    let {network} = state;
    state = {network};
  }
  return appReducer(state, action);
};

const appReducer = combineReducers({
  network: NetworkReducer,
  dashboard: dashboardReducer,
  global: globalReducer,
  notification: notificationReducer,
  response: feedbackReducer,
});

export default rootReducer;
