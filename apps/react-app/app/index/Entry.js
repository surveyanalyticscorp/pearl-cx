/**
 * Created by sachinsable on 10/07/17.
 */
'use strict';

import React from "react";
import {
    AsyncStorage,
    BackHandler,
    NativeEventEmitter,
    NativeModules,
    Navigator,
    Platform
} from "react-native";

import {ActionBarModule} from "../global/native-modules/NativeModules";
import {NotificationsAndroid, NotificationsIOS, PendingNotifications} from "react-native-notifications";
import {apiHandler} from "../global/api/APIHandler";

import CX from "../cx/CX";

var AppActions = require('./AppActions');

if (!__DEV__) {
    global.console.log = () => {}
    global.console.warn = () => {}
    global.console.error = () => {}
}
    /* global URL for Pulse App */
//global.BASE_URL = "http://wf-api.questionpro.com/";
/* global URL for HT, Communities, Cx, Survey App */
global.BASE_URL = "https://wflabs.questionpro.com/";

console.log(global.BASE_URL)

BackHandler.addEventListener('hardwareBackPress', () => {
    console.log("BackPRess");
    if (_navigator) {
        if (_navigator.getCurrentRoutes().length === 1) {
            return false;
        }

        ActionBarModule.toggleBackButton(_navigator.getCurrentRoutes().length > 2);
        ActionBarModule.updateTitleAndMenu(titleAndMenuStack.pop());
        _navigator.pop();
        return true;
    }


    return false;
});

let _navigator;

global.appUser = {};

let mainScreen;

export default class Entry extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        if (Platform.OS != 'ios') {
            NotificationsAndroid.setRegistrationTokenUpdateListener(this.onPushRegistered.bind(this));
            NotificationsAndroid.setNotificationOpenedListener(this.onNotificationOpened.bind(this));
            NotificationsAndroid.setNotificationReceivedListener(this.onNotificationReceived.bind(this));
        }
        this.rnEventEmitter = new NativeEventEmitter(NativeModules.RNNotifications);
        this.eventEmitter = new NativeEventEmitter(NativeModules.NavigationManager);
        this.sceneEventEmitter = new NativeEventEmitter(NativeModules.ContextMenuManager);

    }



    onNotificationReceived(notification) {
        //TODO
    }

    componentDidMount() {
        if (this.props.TOKEN && this.props.TOKEN.length > 0) {
            console.log("token length" + this.props.TOKEN);
             setTimeout( () => {
                 this.onPushRegistered(this.props.TOKEN);
                },1);

        }

        this.backEvenListener = this.eventEmitter.addListener('BackEvent', () => {
            AppActions.backNavigation({});
        });


        if (Platform.OS === 'ios') {
            this.rnEventEmitter.addListener('notificationOpened', (notification) => {
                console.log("notificationOpened in ios method" + notification);
                this.onNotificationOpened(notification);
            });
            this.rnEventEmitter.addListener('notificationReceivedForeground', (notification) => {
                console.log("notificationReceivedForeground" + notification);
                this.onNotificationOpened(notification);
            });
        } else {
            console.log("notification else condition");
        }

        this.DoneButtonListener = this.eventEmitter.addListener("DoneAction", (mapData) => {
            console.log("Done Clicked!");
            AppActions.onDoneClicked(mapData);
        });
        this.ObjButtonListener = this.eventEmitter.addListener("ObjAction", (mapData) => {
            console.log("Obj menu Clicked!");
            AppActions.onObjAndGoalsStatClicked(mapData);
        });
        this.ObjEditListener = this.eventEmitter.addListener("ObjEditMenu", (mapData) => {
            console.log("Obj edit menu Clicked!");
            AppActions.onObjAndGoalsEditClicked(mapData);
        });
        this.ObjEditActionListener = this.sceneEventEmitter.addListener("ObjEditAction", (mapData) => {
            console.log("Obj edit button Clicked!");
            AppActions.onObjAndGoalsEditActionClicked(mapData);
        });
        this.goalsFilterListener = this.sceneEventEmitter.addListener("GoalsFilterAction", (mapData) => {
            console.log("Goals filter clicked!");
            AppActions.onGoalsFilterClicked(mapData);
        });

        this.logoutListener = this.sceneEventEmitter.addListener("Logout", (mapData) => {
            console.log("Logged Out!");
            AppActions.onLogout(mapData)

        });
        this.sceneTransitioner = this.sceneEventEmitter.addListener("SceneTransition", (mapData) => {
            AppActions.sceneTransition(mapData);

        });
        this.languageListener =  this.sceneEventEmitter.addListener("LanguagePicker", (mapData) => {
            AppActions.showLanguagePicker(mapData);

        });

    }

    onPushRegistered(deviceToken) {
        let data = {};
        data.deviceType = Platform.OS === 'ios' ? 1 : 2;
        data.token = deviceToken;
        apiHandler.registerPushToken((response) => {
            console.log('register push token response ='+ response);
            if (response.body.success === true) {
                AsyncStorage.setItem(global.getPushTokenKey, 'true');
            }
        }, this.props.APP_NAME, data, (error) => {
            AsyncStorage.setItem(global.getPushTokenKey, 'false');
        });
    }


    onPushRegistrationFailed = (error) =>{
        console.error(error);
    };

    onNotificationOpened = (notification)=> {
        console.log("Notification opened by device user", notification);
        if (mainScreen) {
            AppActions.notificationOpened(notification);
        }
    };



    configureScene = () => {
        return Navigator.SceneConfigs.FloatFromRight;
    };

    render() {
          mainScreen = this;
          return (<CX {...this.props} />);
    }
}




