/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import CxApp from './app/index';

// console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => CxApp);
