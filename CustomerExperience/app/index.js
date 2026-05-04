import * as React from 'react';

import {store} from './redux/store/store';
import {Provider, useSelector} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';

// import FlashMessage from 'react-native-flash-message';
import SplashScreen from './components/login/SplashScreen';
import AppRouter from './routes/appRouter';
import {NetworkMonitor} from 'react-native-redux-connectivity';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {Platform, StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';
import toastConfig from './config/toastConfig';
import AppTimeTracker from './Utils/AppTimeTracker';
import {sendAnalyticsEvent} from './Utils/AnalyticLogs';
import {ANALYTICS_EVENTS} from './Utils/Analytic.constants';
import AppInfo from './Utils/AppInfo';
import {
  addNotificationListeners,
  checkNotificationPermission,
  requestNotificationPermission,
} from './Utils/NotificationUtils';
import {Colors} from './styles/color.constants';

// import codePush from 'react-native-code-push';

// import Siren from 'react-native-siren';

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
// Inner component to handle app routing logic
const AppContent = () => {
  const [splashInitialized, setSplashInitialized] = React.useState(false);
  const authToken = useSelector(state => state.global.authToken);

  // Add a timing mechanism similar to splash screen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSplashInitialized(true);
    }, 1500); // Give splash screen time to initialize

    return () => clearTimeout(timer);
  }, []);

  // Determine what to render based on app state
  if (!splashInitialized) {
    return <SplashScreen />;
  }

  return <AppRouter />;
};

const CxApp = () => {
  const networkMonitorRef = React.useRef(null);

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
    networkMonitorRef.current = new NetworkMonitor(store);
    networkMonitorRef.current.start();
    requestNotificationPermission();
    checkNotificationPermission();
    // addNotificationListeners();
    return () => {
      if (networkMonitorRef.current) {
        networkMonitorRef.current.stop();
      }
      AppTimeTracker.stop();
    };
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={Colors.white}
          />
          <AppContent />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
};
// let codePushOptions = {
//   installMode: codePush.InstallMode.IMMEDIATE,
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
// };
export default CxApp;
// export default codePush(codePushOptions)(CxApp);
