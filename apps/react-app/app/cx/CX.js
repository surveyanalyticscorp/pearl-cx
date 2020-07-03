/**
 * Created by sachinsable on 10/07/17.
 */
import React, {Component} from "react";
import {AsyncStorage, NativeEventEmitter, NativeModules, Platform} from "react-native";
import {Actions, Router, Scene} from "react-native-router-flux";
import {connect, Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import cxReducers from "./reducers";
import AppStore from "../index/AppStore";
import CXDashboard from "./CXDashboard";
import CXFeedback from "./components/feedback/feedbackList";
import CXFeedbackDetail from './components/feedback/feedbackDetail';
import CXFeedbackUpdate from './components/feedback/feedbackUpdate';
import DetractorTickets from "./DetractorTickets";
import NavigationStateHandler from "../global/NavigationStateHandler";
import {ActionBarModule} from "../global/native-modules/NativeModules";

import {createLogger} from "redux-logger";
import {autoRehydrate, persistStore} from "redux-persist";
import {withNetworkConnectivity} from "react-native-offline";
const RouterWithRedux = connect()(Router);

// var Fabric = require('react-native-fabric');
// var {Crashlytics} = Fabric;

global.titleAndMenuStack = [];
export default class CX extends Component{
    constructor(props) {
        super(props);
        this.eventEmitter = new NativeEventEmitter(NativeModules.NavigationManager);
        this.sceneEventEmitter = new NativeEventEmitter(NativeModules.ContextMenuManager);
        this.store = this.configureStore({isLoading: false, error: false});

        this.persistor = persistStore(this.store, {
            storage: AsyncStorage,
            blacklist: ['routing', 'isLoading', 'isConnected', 'error','feedbackList']
        });


        //Clearing the persisted state on app version update. //TODO: Migration logic

        AsyncStorage.getItem("APP_VERSION", (error, result) => {
            if (result !== props.APP_VERSION) {
                this.persistor.purge();
                AsyncStorage.setItem("APP_VERSION", props.APP_VERSION);
            }

        });

    }


    configureStore(initialState) {
        const loggerMiddleware = createLogger({predicate: (getState, action) => __DEV__});
        const enhancer = compose(
            applyMiddleware(
                thunkMiddleware, // lets us dispatch() functions
                loggerMiddleware
            ),
            autoRehydrate()
        );
        return createStore(cxReducers, initialState, enhancer);
    }


    onNotificationReceived(notification) {
        //TODO
    }

    componentWillMount() {
        AppStore.NotificationStore.addNotificationLisener(this.onNotification.bind(this));
        AppStore.SceneTransitionStore.addSceneTransitionListener(this.onSceneTransition.bind(this));
        AppStore.NavigationStore.addBackNavigationListener(this.onBackNavigation.bind(this));
        AppStore.LogoutStore.addLogoutListener(this.onLogout.bind(this));

    }
    componentWillUnmount() {
        AppStore.NotificationStore.removeNotificationListener(this.onNotification);
        AppStore.SceneTransitionStore.removeSceneTransitionListener(this.onSceneTransition);
        AppStore.NavigationStore.removeBackNavigationListener(this.onBackNavigation);
        AppStore.LogoutStore.removeLogoutListener(this.onLogout);
    }
    onBackNavigation(data){
        if (Platform.OS === 'ios'){
            Actions.pop();
        }

        ActionBarModule.updateTitleAndMenu(global.titleAndMenuStack.pop());
        ActionBarModule.toggleBackButton(global.titleAndMenuStack.length > 0);
    }

    onNotification(notification) {

    }


    onLogout() {
        AsyncStorage.setItem(global.getPushTokenKey, 'false');
        if (this.persistor) {
            this.persistor.purge();
        }
    }
    onSceneTransition = (data) =>{
        switch(data.Scene){
            case "Feedback":
                Actions.cxFeedback();
                ActionBarModule.toggleBackButton(false);
                break;

            case "Dashboard":
                Actions.cxDashboard({type: 'replace'});
                ActionBarModule.toggleBackButton(false);
                break;
        }
    };

    getApp = () =>{
        const navigationStateHandler = new NavigationStateHandler();

        return (
            <RouterWithRedux
                    createReducer={navigationStateHandler.getReducer.bind(navigationStateHandler)}
                    navigationStateHandler={navigationStateHandler}>

                    <Scene key="root" hideNavBar>
                        <Scene key="cxFeedback" component={CXFeedback} type="replace" duration={300}/>
                        <Scene key="cxDashboard" component={CXDashboard} type="push" sceneConfig={false}/>
                        <Scene key="detractorTickets" component={DetractorTickets} type="push"/>
                        <Scene key="cxFeedbackDetail" component={CXFeedbackDetail} type="push"/>
                        <Scene key="cxFeedbackUpdate" component={CXFeedbackUpdate} type="push"/>
                    </Scene>
            </RouterWithRedux>

        )
    };

    render(){
        let App = ()=> (this.getApp());
        global.BASE_URL = this.props.BASE_URL ? this.props.BASE_URL + "/" : "http://api.questionpro.com/";

        let APP = withNetworkConnectivity({
            withRedux: true // It won't inject isConnected as a prop in this case
        })(App);

        return (<Provider store={this.store}>
            {this.getApp()}
        </Provider>);
    }
}
