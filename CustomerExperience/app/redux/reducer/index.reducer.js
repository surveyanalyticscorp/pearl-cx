import {combineReducers} from 'redux';
import feedbackReducer from './FeedbackListReducer';
import dashboardReducer from './DashboardReducer';
import globalReducer from './GlobalReducer';
import {CLEAR_USER_INFO} from '../actions';
import {NetworkReducer} from 'react-native-redux-connectivity';

const rootReducer = (state, action) => {
  if (action.type === CLEAR_USER_INFO) {
    let {network} = state;
    state = {network};
  }
  return appReducer(state, action);
};

const appReducer = combineReducers({
  network: NetworkReducer,
  feedback: feedbackReducer,
  dashboard: dashboardReducer,
  global: globalReducer,
});

export default rootReducer;
