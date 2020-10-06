import {Dimensions, Platform} from 'react-native';
import DeviceInfo from "react-native-device-info";
import {$rem} from './globalStyleVariables';

export const Sizes = {
    icons: DeviceInfo.isTablet() ? 1.4 * $rem : 1.2 * $rem,
};
