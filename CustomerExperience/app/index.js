import * as React from 'react';

import {Component} from 'react';
import {store} from './redux/store/store';
import {Provider} from 'react-redux';
// import FlashMessage from 'react-native-flash-message';
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
import Toast from 'react-native-toast-message';
import toastConfig from './config/toastConfig';
import AppTimeTracker from './Utils/AppTimeTracker';
import {sendAnalyticsEvent} from './Utils/AnalyticLogs';
import {ANALYTICS_EVENTS} from './Utils/Analytic.constants';
import AppInfo from './Utils/AppInfo';

// import codePush from 'react-native-code-push';

// import Siren from 'react-native-siren';

EStyleSheet.build(globalVariables);

const defaultOptions = {
  title: 'Questionpro CX has a new update!',
  forceUpgrade: false,
  message: 'Do you want to update the app?',
};
// convert this class componenet as a functional component

// class CxApp extends Component {
//   constructor() {
//     super();
//     this.networkMonitor = new NetworkMonitor(store);
//     Platform.OS === 'ios' && enableScreens();
//     this.state = {
//       styleBuilt: false,
//     };
//     // Siren.promptUser(defaultOptions)
//   }

//   componentDidMount() {
//     this.networkMonitor.start();
//     EStyleSheet.subscribe('build', () => {
//       this.setState({styleBuilt: true});
//     });
//   }

//   componentWillUnmount() {
//     this.networkMonitor.stop();
//   }

//   render() {
//     return (
//       <Provider store={store}>
//         <SafeAreaProvider>
//           <StatusBar barStyle={'light-content'} />
//           {this.state.styleBuilt ? <SplashScreen /> : <View />}
//           <Toast config={toastConfig} />
//         </SafeAreaProvider>
//       </Provider>
//     );
//   }
// }

// convert this class component as a functional component
const CxApp = () => {
  const [styleBuilt, setStyleBuilt] = React.useState(false);
  const networkMonitor = React.useRef(new NetworkMonitor(store));

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      enableScreens();
    }

    AppTimeTracker.start(totalTime => {
      sendAnalyticsEvent(ANALYTICS_EVENTS.APP_SCREEN_TIME, {
        appScreenTime: JSON.stringify(totalTime),
        ...AppInfo,
      });
    });
    const currentNetworkMonitor = networkMonitor.current;
    currentNetworkMonitor.start();
    const unsubscribe = EStyleSheet.subscribe('build', () => {
      setStyleBuilt(true);
    });

    return () => {
      currentNetworkMonitor.stop();
      AppTimeTracker.stop();
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={'light-content'} />
        {styleBuilt ? <SplashScreen /> : <View />}
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </Provider>
  );
};
// let codePushOptions = {
//   installMode: codePush.InstallMode.IMMEDIATE,
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
// };
export default CxApp;
// export default codePush(codePushOptions)(CxApp);
