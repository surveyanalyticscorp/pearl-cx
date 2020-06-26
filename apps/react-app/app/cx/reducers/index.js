import * as CXDashboardReducer from './CXDashboardReducer';
import * as DetractorTicketReducer from './DetractorTicketReducer';
import * as GlobalReducer from '../../global/reducerLib/globalReducer';
import { combineReducers } from 'redux';
import * as feedbackListReducer from './FeedbackListReducer';
import * as feedbackDetailReducer from './FeedbackDetailReducer';
import { reducer as network } from 'react-native-offline';
export default combineReducers(Object.assign(
  feedbackListReducer,
  feedbackDetailReducer,
  GlobalReducer,
{network}
));