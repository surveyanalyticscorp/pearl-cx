import { combineReducers } from 'redux';
import * as dashboardReducer from './DashboardReducer';
import * as profileReducer from './ProfileReducer';
import * as homeReducer from './HomeReducer';
import * as orgViewReducer from './OrgViewReducer';
import * as globalReducer from '../../global/reducerLib/globalReducer';
import * as employeeReducer from './EmployeeReducer';
import * as reviewReducer from './ReviewReducer';
import * as reviewInfoReducer from './ReviewInfoReducer';
import * as reviewCategoryReducer from './ReviewCategoryReducer';
import * as reviewItemsReducer from './ReviewItemsReducer';
import * as reviewFilterCategoryReducer from './ReviewFilterCategoryReducer';
import * as reviewEmployeeListReducer from './ReviewEmployeeListReducer';
import * as reviewEmployeeNetworkListReducer from './ReviewEmployeeNetworkListReducer';
import * as reviewMyReviewsReducer from './ReviewMyReviewsReducer';
import * as reviewMyReviewsReceivedReducer from './ReviewMyReviewReceivedReducer';
import * as reviewMyReviewsRequestReducer from './ReviewMyReviewRequestsReducer';
import * as reviewReceivedRequestReducer from './ReviewReceivedRequestsReducer';
import * as goalsNObjectiveReducers from './GoalsNObjectiveReducers';
import * as praiseReducer from './PraiseReducer';
import * as askHomePageReducer from './AskHomePageReducer';
import * as HistoryReducer from './HistoryReducer'
import * as pendingQuestionsListReducer from './PendingQuestionsListReducer';
import * as praiseNewBadgeReducer from './PraiseNewBadgeReducer';
import * as UserBadgesReducer from './UserBadgesReducer';
import * as GoalsNewObjective from './GoalsNewObjective';
import * as PathFinderReducer from './PathFinderReducer';
import { reducer as network } from 'react-native-offline';
export default combineReducers(
  Object.assign(
    dashboardReducer,
    profileReducer,
    homeReducer,
    orgViewReducer,
    globalReducer,
    employeeReducer,
    reviewReducer,
    reviewInfoReducer,
    reviewCategoryReducer,
    reviewItemsReducer,
    reviewMyReviewsReceivedReducer,
    reviewMyReviewsRequestReducer,
    reviewFilterCategoryReducer,
    reviewEmployeeListReducer,
    reviewEmployeeNetworkListReducer,
    reviewMyReviewsReducer,
    reviewReceivedRequestReducer,
    goalsNObjectiveReducers,
    praiseReducer,
    askHomePageReducer,
    HistoryReducer,
    pendingQuestionsListReducer,
    praiseNewBadgeReducer,
    UserBadgesReducer,
    GoalsNewObjective,
      PathFinderReducer,
      {network}
  )
);
