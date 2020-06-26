/**
 * Created by sachinsable on 12/07/17.
 */
import React, {Component} from 'react';
import {AsyncStorage, NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {ActionConst, Actions, Modal, Router, Scene} from 'react-native-router-flux';
import {connect, Provider} from 'react-redux';
import Test from './test';
import flashletReducers from './reducers';
import AppStore from '../index/AppStore';
import PulseHome from './components/pulseHome/PulseHome';
import NavigationStateHandler from '../global/NavigationStateHandler';
import SupervisorModal from './components/pulseHome/SupervisorModal';
import CommentBox from './components/pulseHome/CommentBox';
import EmployeeProfile from './components/profile/EmployeeProfile';
import HeuristicDashboard from './components/dashboard/HeuristicDashboard';
import Feedback from './components/feedback/Feedback';
import OrgTreeView from './components/dashboard/OrgTreeView';
import ReviewDragNDrop from './components/review/ReviewDragNDrop';
import ReviewInfiniteScrollOval from './components/review/ReviewInfiniteScrollOval';
import ReviewCategories from './components/review/ReviewCategories';
import ReviewSummary from './components/review/ReviewSummary';
import AttributeSelection from './components/review/AttributeSelection';
import CompetencySelection from './components/review/CompetencySelection';
import ReviewSwiper from './components/review/ReviewSwiper';
import EmployeeList from './components/review/ReviewEmployeeList';
import WelcomeScreen from './components/review/WelcomeScreen';
import ObjAndGoals from './components/goals/ObjectiveList';
import ObjAndGoalDetail from './components/goals/ObjectiveDetail';
import Praise from './components/praise/PraiseList';
import PraiseDetail from './components/praise/PraiseDetail';
import PraiseComment from './components/praise/PraiseNew/PraiseComment';
import configureStore from '../index/configureStore';
import PraiseUsers from './components/praise/PraiseNew';

import CommentView from './components/review/ReviewSummary/CommentView';
import {withNetworkConnectivity} from 'react-native-offline';
// var Fabric = require('react-native-fabric');
// var { Crashlytics } = Fabric;
import {ActionBarModule} from '../global/native-modules/NativeModules';

import {createLogger} from 'redux-logger';
import {autoRehydrate, persistStore} from 'redux-persist';
import PathFinder from './components/pathfinder';
import Result from './components/pathfinder/Result';
import MyReviews from "./components/employeeList/MyReviews/MyReviews";
import Ask from './components/home';
import AskedQuestionsList from "./components/ask/homePage";
import AddQuestion from "./components/ask/addQuestion";
import HistoryList from "./components/ask/history/HistoryList";
import AskDashboard from "./components/ask/history/AskDashboard";

const RouterWithRedux = connect()(Router);
global.titleAndMenuStack = [];

export default class Flashlet extends Component {
    constructor(props) {
        super(props);
        this.eventEmitter = new NativeEventEmitter(NativeModules.NavigationManager);
        this.sceneEventEmitter = new NativeEventEmitter(
            NativeModules.ContextMenuManager
        );
        this.state = {
            isLoading: true,
            store: configureStore(props.APP_VERSION, {isLoading: false}, flashletReducers, (persistor) => {
                this.setState({isLoading: false});
                this.persistor = persistor;
            })

        }


    }


    componentWillMount() {
        AppStore.NotificationStore.addNotificationLisener(
            this.onNotification.bind(this)
        );
        AppStore.SceneTransitionStore.addSceneTransitionListener(
            this.onSceneTransition.bind(this)
        );
        AppStore.NavigationStore.addBackNavigationListener(
            this.onBackNavigation.bind(this)
        );
        AppStore.LogoutStore.addLogoutListener(this.onLogout.bind(this));
    }

    componentWillUnmount() {
        AppStore.NotificationStore.removeNotificationListener(this.onNotification);
        AppStore.SceneTransitionStore.removeSceneTransitionListener(
            this.onSceneTransition
        );
        AppStore.NavigationStore.removeBackNavigationListener(
            this.onBackNavigation
        );
        AppStore.LogoutStore.removeLogoutListener(this.onLogout);
    }

    onBackNavigation(data) {
        if (Platform.OS === 'ios') {
            Actions.pop();
        }

        ActionBarModule.updateTitleAndMenu(global.titleAndMenuStack.pop());
        ActionBarModule.toggleBackButton(global.titleAndMenuStack.length > 0);
    }

    onNotification(notification) {
        let campaignBatchID;
        let payloadType;
        if (Platform.OS !== 'ios') {
            let messageData = JSON.parse(notification.data.message);
            payloadType = notification.data.type;
            campaignBatchID = messageData.infoMap.campaignBatchID;
        } else {
            campaignBatchID = notification.info.campaignBatchID;
            payloadType = notification.info.type;
        }
        Actions.pulseHome({
            type: ActionConst.REFRESH,
            notificationType: payloadType,
            campaignBatchID: campaignBatchID
        });
    }

    onSceneTransition(data) {
        switch (data.Scene) {

            case 'Home':
                Actions.home();
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: 'Home'})
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Pulse':
                Actions.pulse();
                break;
            case 'Profile':
                Actions.employeeProfile();

                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: 'Profile'})
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Feedback':
                Actions.feedback();

                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: 'Feedback'})
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Ask':
                Actions.askedQuestionList();
                ActionBarModule.updateTitleAndMenu(JSON.stringify({title: 'Ask'}));
                ActionBarModule.toggleBackButton(false);
                break;
            case 'History':
                Actions.history();
                ActionBarModule.updateTitleAndMenu(JSON.stringify({title: 'History'}));
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Employees':
                Actions.heuristicDashboard();
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: 'Dashboard'})
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Org Chart':
                Actions.orgTreeView();
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: 'Org Chart'})
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Performance Review':
                Actions.welcomeScreen();
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: 'Welcome to Pulse Review'})
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Objectives and Goals':
                Actions.objAndGoals();
                this.state.store.dispatch({
                    type: 'GOALS_NEW_OBJECTIVE',
                    data: {add: false}
                });
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({
                        title: 'Objectives and Goals',
                        showMenu: true,
                        showStat: true,
                        selected: 'Active'
                    })
                );
                ActionBarModule.toggleBackButton(false);
                break;
            case 'Praise':
                Actions.praise();
                ActionBarModule.updateTitleAndMenu(JSON.stringify({title: 'Praise'}));
                ActionBarModule.toggleBackButton(false);
                break;

            case 'PathFinder' :
                Actions.rate();
                ActionBarModule.updateTitleAndMenu(JSON.stringify({title: data.Scene}));
                ActionBarModule.toggleBackButton(false);
                break;
        }
    }

    onLogout() {
        AsyncStorage.setItem(global.getPushTokenKey, 'false');
        if (this.persistor) {
            this.persistor.purge();
        }
    }

    getApp() {
        const navigationStateHandler = new NavigationStateHandler();
        let scene = this.props.scene;
        if (!scene) {
            scene = 'home';
        }

        return (
            <RouterWithRedux
                createReducer={navigationStateHandler.getReducer.bind(
                    navigationStateHandler
                )}
                navigationStateHandler={navigationStateHandler}
                hideNavBar
            >
                <Scene key="modal" component={Modal}>
                    <Scene key="root">
                        <Scene key="home" initial={'home' === scene} type="replace"
                               component={Ask}>

                        </Scene>

                        <Scene key="pulse" type="replace">
                            <Scene key="pulseHome" component={PulseHome}/>
                            <Scene key="commentBox" component={CommentBox} type="push"/>
                        </Scene>
                        <Scene
                            key="employeeProfile"
                            initial={'employeeProfile' === scene}
                            component={EmployeeProfile}
                            type="replace"
                        />
                        <Scene
                            key="askedQuestionList"
                            component={AskedQuestionsList}
                            type="replace"
                        />
                        <Scene
                            key="addQuestion"
                            component={AddQuestion}
                            type="push"
                            duration={250}
                        />
                        <Scene key="history"
                               type={"replace"}
                            >
                            <Scene key={"historyList"} component={HistoryList}/>
                            <Scene key={"askDashboard"} component={AskDashboard} type={"push"}/>

                        </Scene>
                        <Scene key="feedback" component={Feedback} type="reset"/>
                        <Scene
                            initial={'welcomeScreen' === scene}
                            passProps={{isFromPush: scene === 'welcomeScreen'}}
                            key="welcomeScreen"
                            component={WelcomeScreen}
                            type="replace"
                            duration={1}
                        />
                        <Scene
                            key="test"
                            component={Test}
                            type="push"
                            direction="vertical"
                        />
                        <Scene
                            key="competencySelection"
                            component={CompetencySelection}
                            panHandlers={null}
                            type="push"
                            duration={250}
                        />
                        <Scene
                            key="myReviews"
                            component={MyReviews}
                            panHandlers={null}
                            type="push"
                            duration={250}
                        />
                        <Scene
                            key="attributeSelection"
                            component={AttributeSelection}
                            panHandlers={null}
                            type="push"
                            duration={250}
                        />
                        <Scene
                            key="reviewSwiper"
                            component={ReviewSwiper}
                            panHandlers={null}
                            type="push"
                            duration={250}
                        />
                        <Scene
                            key="reviewDragNDrop"
                            component={ReviewDragNDrop}
                            type="push"
                            duration={250}
                        />
                        <Scene
                            key="reviewInfiniteScrollOval"
                            component={ReviewInfiniteScrollOval}
                            type="push"
                            duration={250}
                        />
                        <Scene
                            key="reviewCategories"
                            component={ReviewCategories}
                            panHandlers={null}
                            duration={250}
                            type="push"
                        />
                        <Scene
                            key="reviewsummary"
                            component={ReviewSummary}
                            panHandlers={null}
                            duration={250}
                            type="push"
                        />
                        <Scene
                            key="commentView"
                            component={CommentView}
                            panHandlers={null}
                            duration={0}
                            type="push"
                        />
                        <Scene
                            key="employeeList"
                            component={EmployeeList}
                            type="replace"
                            duration={250}
                        />
                        <Scene
                            key="heuristicDashboard"
                            component={HeuristicDashboard}
                            type="replace"
                        />
                        <Scene key="orgTreeView" component={OrgTreeView} type="replace"/>
                        <Scene
                            key="objAndGoals"
                            component={ObjAndGoals}
                            type="replace"
                            panHandlers={null}
                            duration={1}
                        />
                        <Scene
                            key="objAndGoalDetail"
                            component={ObjAndGoalDetail}
                            type="push"
                            panHandlers={null}
                            duration={250}
                        />
                        <Scene
                            key="praise"
                            component={Praise}
                            type="replace"
                            panHandlers={null}
                            duration={1}
                        />
                        <Scene
                            key="praiseDetail"
                            component={PraiseDetail}
                            type="push"
                            panHandlers={null}
                            duration={250}
                        />
                        <Scene
                            key="praiseComment"
                            component={PraiseComment}
                            type="push"
                            panHandlers={null}
                        />
                        <Scene
                            key="rate"
                            component={PathFinder}
                            type="replace"
                            panHandlers={null}
                        />
                        <Scene
                            key="result"
                            component={Result}
                            type="replace"
                            panHandlers={null}
                        />

                    </Scene>
                    <Scene key="praiseUsers" component={PraiseUsers} type="push"/>
                    <Scene key="supervisorModal" component={SupervisorModal}/>
                </Scene>
            </RouterWithRedux>
        )
    }

    render() {

        if (this.state.isLoading) {
            return null;
        }


        let App = () => (this.getApp());

        mainScreen = this;

        global.BASE_URL = this.props.BASE_URL
            ? this.props.BASE_URL + '/'
            : 'http://wflabs.questionpro.com/';
        if (this.props.APP_USER) {
            global.appUser = this.props.APP_USER;
            /*Crashlytics.setString('panelID', '' + this.props.APP_USER.panelID);
            Crashlytics.setString('memberID', '' + this.props.APP_USER.ID);
            if (this.props.APP_USER.emailID) {
              Crashlytics.setUserEmail(this.props.APP_USER.emailID);
            }*/
            // console.log(JSON.stringify(global.appUser));
        }
        if (this.props.APP_VERSION) {
            global.APP_VERSION = this.props.APP_VERSION;
        }
        if (this.props.fromLogin) {
            //console.log("From Login" + this.props.fromLogin);
            global.fromLogin = this.props.fromLogin;
        }
        let APP = withNetworkConnectivity({
            withRedux: true // It won't inject isConnected as a prop in this case
        })(App);
        return (
            <Provider store={this.state.store}>
                <APP/>
            </Provider>
        );
    }
}
