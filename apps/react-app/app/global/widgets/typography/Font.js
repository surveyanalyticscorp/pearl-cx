'use strict';

var React = require('react-native');
import {Dimensions,StyleSheet} from 'react-native';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;


// declare a global varible
global.screenSizeFactor = factor;
global.primaryText = 'ProximaNova-Regular';

global.boldText = 'ProximaNovaA-Bold';

global.semiBoldText = 'ProximaNovaA-Semibold';

global.lightText = 'ProximaNova-Light';
global.h1FontSize = Math.round(factor * 0.08);
global.h1by2FontSize = Math.round(factor * 0.055);
global.h2FontSize = Math.round(factor * 0.042);
global.h2by2FontSize = Math.round(factor * 0.040);
global.h3FontSize = Math.round(factor * 0.035);

global.h4FontSize = Math.round(factor * 0.03);
global.h5FontSize = Math.round(factor * 0.025);
global.h6FontSize = Math.round(factor * 0.02);

global.smallFontSize = Math.round(factor * 0.015);
global.largeFontSize = Math.round(factor * 0.5);
