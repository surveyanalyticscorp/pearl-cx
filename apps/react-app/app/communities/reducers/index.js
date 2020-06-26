import { combineReducers } from 'redux';

import {AsyncStorage} from 'react-native';
import * as homeReducer from './HomeReducer'
import * as globalReducer from '../../global/reducerLib/globalReducer';
import * as LeaderboardReducer from './LeaderboardReducer'
import * as MyProfileReducer from './MyProfileReducer'
import * as CollabrationReducer from './CollabrationReducer'
import * as ActivityHistoryReducer from './ActivityHistoryReducer'
import * as LocalizationReducer from './LocalizationReducer'
import * as LocationSurveyReducer from './LocationSurveyReducer';
import * as SurveyReducer from './SurveyReducer';
import * as DocumentReducer from './DocumentReducer';
import * as EventsReducer from './EventsReducer';
import { reducer as network } from 'react-native-offline';
export default combineReducers(Object.assign(
  homeReducer,
  globalReducer,
  LeaderboardReducer,
  MyProfileReducer,
  CollabrationReducer,
  ActivityHistoryReducer,
    LocalizationReducer,
    LocationSurveyReducer,
    SurveyReducer,
    DocumentReducer,
    EventsReducer,
    {network}
));
