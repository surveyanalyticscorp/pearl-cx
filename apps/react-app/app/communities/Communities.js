/**
 * Created by sachinsable on 10/07/17.
 */
import React, {Component} from "react";
import {AsyncStorage, DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform,} from "react-native";
import './I18n/I18n';
import SafeAreaView from 'react-native-safe-area-view';
import {ActionConst, Actions, Modal, Router, Scene} from "react-native-router-flux";
import {connect, Provider} from "react-redux";
import NavigationStateHandler from "../global/NavigationStateHandler";
import ImageDetailView from '../global/ui/ImageDetailView';
import {ActionBarModule} from "../global/native-modules/NativeModules";
import SurveysTab from "./surveys/SurveysTab";
import HomeTab from "./home/HomeTab";
import ProfileTab from "./profile/ProfileTab";
import LeaderBoardTab from "./leaderboard/LeaderboardTab";
import UpdateProfile from "./profile/UpdateProfile";
import InviteViaEmail from "./profile/InviteViaEmail";
import ActivityHistory from "./profile/ActivityHistory";
import TakeSurvey from "./home/TakeSurvey";
import RedeemRewardModal from './profile/RedeemRewardModal';
import CollaborationsTab from "./collaborate/CollaborationsTab";
import LiveDiscussion from "./collaborate/chat/LiveDiscussion";
import AddIdea from './collaborate/ideaboard/AddIdea';
import IdeaDetails from './collaborate/ideaboard/IdeaDetails';
import TopicDetails from './collaborate/topics/TopicDetails';
import IdeaList from './collaborate/ideaboard/IdeaList';
import TopicsList from './collaborate/topics/TopicList';
import AddTopic from './collaborate/topics/AddTopic';
import Surveys from './home/Surveys';
import LanguagePicker from "./LanguagePickerModal";
import AppStore from "../index/AppStore";
import communitiesReducer from './reducers';
import configureStore from '../index/configureStore';
import {withNetworkConnectivity} from 'react-native-offline';
import {apiHandler} from "../global/api/APIHandler";
import Reimbursement from "../communities/reimbursement/Reimbursement"
import {MenuProvider} from 'react-native-popup-menu';
import EditComment from "./collaborate/comments/EditComment";
import Documents from "./documents/Documents"
import DocumentViewer from "./documents/DocumentViewer/DocumentViewer"
import Events from  "./events/Events"
import EventDescriptionView from "./events/eventDescription/EventDescriptionView"
import EventVideoDescriptionView from "./events/eventDescription/EventVideoDescriptionView"
import DocumentCollaborateViewer from "./collaborate/documentViewer/DocumentCollaborateViewer"

const RouterWithRedux = connect()(Router);
global.titleAndMenuStack = [];
export const backDropStyle = {
    backgroundColor: '#000',
    opacity: 0.6
}
export default class Communities extends Component {
    constructor(props) {
        super(props);
        this.eventEmitter = new NativeEventEmitter(NativeModules.NavigationManager);
        this.sceneEventEmitter = new NativeEventEmitter(NativeModules.ContextMenuManager);

        this.notificationNumber = 1;
        this.state = {
            isLoading: true,
            store: configureStore(props.APP_VERSION, {
                isLoading: false,
                language: 'en'
            }, communitiesReducer, (persistor) => {
                this.setState({isLoading: false});
                this.persistor = persistor;
            })

        }
    }


    componentWillMount() {
        AppStore.NotificationStore.addNotificationLisener(this.onNotification.bind(this));
        AppStore.SceneTransitionStore.addSceneTransitionListener(this.onSceneTransition.bind(this));
        AppStore.NavigationStore.addBackNavigationListener(this.onBackNavigation.bind(this));
        AppStore.LogoutStore.addLogoutListener(this.onLogout.bind(this));
        AppStore.ShowLanguagePickerStore.addShowLanguagePickerListener(this.showLanguagePicker.bind(this));
        DeviceEventEmitter.addListener("updateLanguageId", (mapData) => {
            //global.languageId = mapData.languageId;
            //console.log("Language Id:" + global.languageId);
            //this.onSetLanguage();
        });


    }

    componentWillUnmount() {
        AppStore.NotificationStore.removeNotificationListener(this.onNotification);
        AppStore.SceneTransitionStore.removeSceneTransitionListener(this.onSceneTransition);
        AppStore.NavigationStore.removeBackNavigationListener(this.onBackNavigation);
        AppStore.LogoutStore.removeLogoutListener(this.onLogout);
        AppStore.ShowLanguagePickerStore.addShowLanguagePickerListener(this.showLanguagePicker);
    }

    onBackNavigation(data) {
        if (Platform.OS === 'ios') {
            Actions.pop();
        }

        ActionBarModule.updateTitleAndMenu(global.titleAndMenuStack.pop());
        ActionBarModule.toggleBackButton(global.titleAndMenuStack.length > 0);
    }


    showLanguagePicker() {
        Actions.languagePicker({});


    }

    onSceneTransition(data) {
        switch (data.Scene) {
            case "Profile":
                Actions.profileTab();
                break;
            case "Collaborate":
                Actions.collabrationsTab();
                break;
            case "Documents":
                Actions.documentsTab();
                break;
            case "Home":
                Actions.homeTab();
                break;
            case "Leaderboard":
                Actions.leaderBoardTab();
                break;
            case "Surveys":
                Actions.surveyTab();
                break;
            case "Reimbursement":
                Actions.ReimbursementTab();
                break;
            case "Events" :
                Actions.eventsTab();
                break;
        }

        ActionBarModule.updateTitleAndMenu(JSON.stringify({"title": '' + data.Title}));
        ActionBarModule.toggleBackButton(false);

    }

    onNotificationReceived(notification) {
        //TODO
    }

    onNotification(notification) {
        if (mainScreen) {
            let payloadType = Platform.OS !== 'ios' ? notification.data.type : notification.info.type;
            Actions.home({
                type: ActionConst.REFRESH,
                notificationType: payloadType,
                notificationNumber: this.notificationNumber++
            });
        }
    }

    getSurveyURL(id) {
        //return global.BASE_URL + "";
        return "http://qa.surveyanalytics.com/t/VDXjZe0dK";
    }

    onLogout(data) {
        AsyncStorage.setItem(global.getPushTokenKey, 'false');
        AsyncStorage.setItem("SURVEY_DB_MODIFIED_TIME", "0");
        if (this.persistor) {
            this.persistor.purge();
        }
        apiHandler.callLogoutAPI();

    }


    getApp() {
        const {APP_NAME, scene} = this.props;
        const navigationStateHandler = new NavigationStateHandler();
        switch (APP_NAME) {
            case "POSITEv":
                return (
                    <RouterWithRedux
                        createReducer={navigationStateHandler.getReducer.bind(navigationStateHandler)}
                        navigationStateHandler={navigationStateHandler}>
                        <Scene key="modal" component={Modal}>
                            <Scene key="root" hideNavBar>
                                <Scene key="homeTab" type='replace'>
                                    <Scene key="home" component={Surveys} hideNavBar {...this.props} />
                                    <Scene key="takesurvey" type="push" component={TakeSurvey} hideTabBar
                                           style={{paddingBottom: 0}}/>

                                </Scene>
                            </Scene>
                        </Scene>
                    </RouterWithRedux>

                );
            default:
                return (<RouterWithRedux
                    createReducer={navigationStateHandler.getReducer.bind(navigationStateHandler)}
                    navigationStateHandler={navigationStateHandler}>
                    <Scene key="modal" component={Modal}>
                        <Scene key="root" hideNavBar>

                            <Scene key="homeTab" type='replace' initial={'Home' === scene} gesturesEnabled={false}
                                   hideNavBar>
                                <Scene key="home" component={HomeTab} hideNavBar {...this.props} />
                            </Scene>

                            <Scene key="ReimbursementTab" type='replace' gesturesEnabled={false} hideNavBar>
                                <Scene key="reimbursement" component={Reimbursement} hideNavBar {...this.props} />
                                <Scene key="takesurveys" type="push" component={TakeSurvey} hideTabBar
                                style={{paddingBottom: 0}}/>
                            </Scene>

                            <Scene key="surveyTab" type='replace' initial={'Surveys' === scene} gesturesEnabled={false} hideNavBar>
                                <Scene key="survey" component={SurveysTab} hideNavBar {...this.props} />
                                <Scene key="takesurvey" type="push" component={TakeSurvey} hideTabBar
                                       style={{paddingBottom: 0}}/>
                            </Scene>

                            <Scene key="collabrationsTab" type='replace' hideNavBar hideTabBar gesturesEnabled={false}>
                                <Scene key="collaborate" component={CollaborationsTab}/>
                                <Scene key="liveDiscussion" component={LiveDiscussion}/>
                                <Scene key="addIdea" component={AddIdea}/>
                                <Scene key="ideaList" component={IdeaList}/>
                                <Scene key="addTopic" component={AddTopic}/>
                                <Scene key="topicsList" component={TopicsList}/>
                                <Scene key="ideaDetails" component={IdeaDetails}/>
                                <Scene key="topicDetails" component={TopicDetails}/>
                                <Scene key="editComment" component={EditComment}/>
                                <Scene key="documentCollaborate" component={DocumentCollaborateViewer}/>
                            </Scene>
                            <Scene key="documentsTab" type='replace' gesturesEnabled={false} hideNavBar>
                                <Scene key="documents" component={Documents} hideNavBar {...this.props} />
                                <Scene key="documentViewer" type="push" component={DocumentViewer} hideTabBar
                                       style={{paddingBottom: 0}}/>
                            </Scene>

                            <Scene key="eventsTab" type='replace' gesturesEnabled={false} hideNavBar>
                                <Scene key="events" component={Events} hideNavBar {...this.props} />
                                <Scene key="eventDescription" type="push" component={EventDescriptionView} hideTabBar
                                       style={{paddingBottom: 0}}/>
                                <Scene key="eventVideoDescription" type="push" component={EventVideoDescriptionView} hideTabBar
                                       style={{paddingBottom: 0}}/>
                            </Scene>

                            <Scene key="profileTab" type='replace' gesturesEnabled={false} hideNavBar>
                                <Scene key="profile" component={ProfileTab} hideNavBar/>
                                <Scene key="activityhistory" component={ActivityHistory} hideTabBar
                                       style={{paddingBottom: 0}}/>
                                <Scene key="editProfile" component={UpdateProfile} hideTabBar
                                       style={{paddingBottom: 0}}/>
                                <Scene key="inviteViaEmail" component={InviteViaEmail} hideTabBar
                                       style={{paddingBottom: 0}}/>
                            </Scene>
                            <Scene key="leaderBoardTab" type='replace'
                                   component={LeaderBoardTab} gesturesEnabled={false}/>

                        </Scene>

                        <Scene key="languagePicker" component={LanguagePicker}/>
                        <Scene key="redeemReward" component={RedeemRewardModal}/>
                        <Scene key="imageDetail" component={ImageDetailView} transparent={true}/>
                    </Scene>


                </RouterWithRedux>);
        }
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }
        let App = () => (this.getApp());
        mainScreen = this;
        global.BASE_URL = this.props.BASE_URL ? this.props.BASE_URL + "/" : "https://api.surveyanalytics.com/";
        if (this.props.APP_USER != null) {
            global.appUser = this.props.APP_USER;
        }
        if (this.props.fromLogin !== undefined) {
            global.fromLogin = this.props.fromLogin;
        }
        let APP = withNetworkConnectivity({
            withRedux: true // It won't inject isConnected as a prop in this case
        })(App);
        return (
            <MenuProvider customStyles={{backdrop: backDropStyle}}>
                <Provider store={this.state.store}>
                    <SafeAreaView forceInset={{bottom: 'always'}} style={{flex: 1}}>
                        <APP/>
                    </SafeAreaView>
                </Provider>
            </MenuProvider>
        );

    }
}
