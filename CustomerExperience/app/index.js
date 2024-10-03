import React, {Component} from 'react';
import {store} from './redux/store/store';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './components/login/SplashScreen';
import {NetworkMonitor} from 'react-native-redux-connectivity';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as globalVariables from '../app/styles/globalStyleVariables';
import {View, Platform, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {MarginConstants} from './styles/margin.constants';
import Toast from 'react-native-toast-message';
import toastConfig from './config/toastConfig';

// import codePush from 'react-native-code-push';

// import Siren from 'react-native-siren';

EStyleSheet.build(globalVariables);

const defaultOptions = {
  title: 'Questionpro CX has a new update!',
  forceUpgrade: false,
  message: 'Do you want to update the app?',
};

const CustomFlashMessage = () => {
  const insets = useSafeAreaInsets();
  return (
    <FlashMessage
      // style={{borderRadius: 4}}
      animated={true}
      position={{
        // top: DeviceInfo.hasDynamicIsland() ? (DeviceInfo.hasNotch() ? 59 : ) : 0,
        top: insets.top + MarginConstants.tab1_2x,
        left: insets.left + MarginConstants.tab1_2x,
        right: insets.right + MarginConstants.tab1_2x,

        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
      }}
    />
  );
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
          {/* <CustomFlashMessage /> */}
          <Toast config={toastConfig} />
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
