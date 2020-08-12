
import React, {Component} from 'react';

import 'react-native-gesture-handler';

import CXFeedback from "./components/feedback/feedbackList";
import CXDashboard from "./CXDashboard";
import {autoRehydrate, persistStore} from "redux-persist";
import {AsyncStorage} from "react-native";
import {createLogger} from "redux-logger";
import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import cxReducers from "./reducers";
import Provider from "react-redux/es/components/Provider";


import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {createStackNavigator} from '@react-navigation/stack'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


export default class CxHome extends Component{

    constructor(props){
        super(props);

        this.store = this.configureStore({isLoading: false, error: false});

        this.persistor = persistStore(this.store, {
            storage: AsyncStorage,
            blacklist: ['routing', 'isLoading', 'isConnected', 'error','feedbackList']
        });
    }


    render(){
        return(<Provider store={this.store}>
                <NavigationContainer>
                    <Drawer.Navigator>
                        <Drawer.Screen name = 'Feedback' component={CXFeedback}/>
                        <Drawer.Screen name = 'Dashboard' component={CXDashboard}/>
                    </Drawer.Navigator>

                </NavigationContainer>
            </Provider>
        );
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
}