// import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {Component} from 'react';
import {store} from './redux/store/store';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './components/login/SplashScreen';
import {NetworkMonitor} from 'react-native-redux-connectivity';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as globalVariables from '../app/styles/globalStyleVariables';
import {View, Platform, StatusBar} from 'react-native';
// import codePush from 'react-native-code-push';

// import Siren from 'react-native-siren';

EStyleSheet.build(globalVariables);

const defaultOptions = {
  title: 'Questionpro CX has a new update!',
  forceUpgrade: false,
  message: 'Do you want to update the app?',
};

class CxApp extends Component {
  constructor() {
    super();
    this.networkMonitor = new NetworkMonitor(store);
    Platform.OS === 'ios' && enableScreens();
    this.state = {
      styleBuilt: false,
    };
    // Siren.promptUser(defaultOptions)
  }

  componentDidMount() {
    this.networkMonitor.start();
    EStyleSheet.subscribe('build', () => {
      this.setState({styleBuilt: true});
    });
  }

  componentWillUnmount() {
    this.networkMonitor.stop();
  }

  render() {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar barStyle={'light-content'} />
          {this.state.styleBuilt ? <SplashScreen /> : <View />}
          <FlashMessage position="top" />
        </SafeAreaProvider>
      </Provider>
    );
  }
}

// let codePushOptions = {
//   installMode: codePush.InstallMode.IMMEDIATE,
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
// };
export default CxApp;
// export default codePush(codePushOptions)(CxApp);
