import React, {Component} from 'react';
import {store} from './redux/store/store';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './components/login/SplashScreen';
import {NetworkMonitor} from 'react-native-redux-connectivity'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as globalVariables from '../app/styles/globalStyleVariables';
import {View} from 'react-native-animatable';

EStyleSheet.build(globalVariables);

export default class CxApp extends Component {

    constructor(){
        super();
        this.networkMonitor = new NetworkMonitor(store);
        Platform.OS === 'ios' && enableScreens();
        this.state = {
            styleBuilt : false,
        };
    }

    componentDidMount() {
        this.networkMonitor.start();
        EStyleSheet.subscribe('build', () => {
            this.setState({styleBuilt:true});
        });
    }

    componentWillUnmount() {
        this.networkMonitor.stop();
    }

    render() {
        return (
            <Provider store={store}>
                <SafeAreaProvider>
                    {this.state.styleBuilt ? <SplashScreen /> : <View/>}
                    <FlashMessage position="top"/>
                </SafeAreaProvider>
            </Provider>
        );
    }
}
