import * as HomeActions from './HomeActions';
import * as GlobalActions from '../../global/reducerLib/globalAction';
import * as LeaderboardActions from './LeaderboardAction';
import * as MyProfileActions from './MyProfileActions'
import * as CollabrationActions from './CollabrationActions'
import * as ActivityHistoryActions from './ActivityHistoryActions'
import * as LocalizationActions from './LocalizationActions'
import * as LocationSurveyActions from './LocationSurveyActions';
import * as SurveyActions from './SurveyActions';
import * as DocumentsAction from './DocumentsAction';
import * as EventsActions from './EventsActions';
export const ActionCreators = Object.assign({},
    SurveyActions,
    HomeActions,
    GlobalActions,
    LeaderboardActions,
    MyProfileActions,
    CollabrationActions,
    ActivityHistoryActions,
    LocalizationActions,
    LocationSurveyActions,
    DocumentsAction,
    EventsActions
    );
