import DeviceInfo from "react-native-device-info";
import {$rem} from './globalStyleVariables';

export const Sizes = {
    icons: DeviceInfo.isTablet() ? 1 * $rem : 1.2 * $rem,
    inlineIcons:  DeviceInfo.isTablet() ? 0.8 * $rem : 1 * $rem,
    filterIcon: DeviceInfo.isTablet() ? 1.3 * $rem : 1.5 * $rem,
};
