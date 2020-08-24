import React, {Component} from 'react';
import {store} from './redux/store/store';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './components/login/SplashScreen';
import {NetworkMonitor} from 'react-native-redux-connectivity'
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default class CxApp extends Component {

    constructor(){
        super();
        this.networkMonitor = new NetworkMonitor(store);
    }

    componentDidMount() {
        this.networkMonitor.start();
    }

    componentWillUnmount() {
        this.networkMonitor.stop();
    }

    render() {
        return (
            <Provider store={store}>
                <SafeAreaProvider>
                    <SplashScreen />
                    <FlashMessage position="top"/>
                </SafeAreaProvider>
            </Provider>
        );
    }
}
