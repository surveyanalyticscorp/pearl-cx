import * as DashboardActions from './DashboardActions';
import * as ProfileActions from './ProfileAction';
import * as HomeActions from './HomeActions';
import * as OrgViewActions from './OrgViewActions';
import * as GlobalActions from '../../global/reducerLib/globalAction';
export const ActionCreators = Object.assign({},
    DashboardActions,
    ProfileActions,
    HomeActions,
    OrgViewActions,
    GlobalActions
    );