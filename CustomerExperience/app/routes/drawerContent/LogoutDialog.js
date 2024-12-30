import {Alert} from 'react-native';
import {translate} from '../../Utils/MultilinguaUtils';

const logoutDialog = (onPressOk, onPressCancel) => {
  return Alert.alert(
    translate('logout_confirmation_message'),
    '',
    [
      {
        text: translate('yes'),
        onPress: onPressOk,
      },
      {
        text: translate('no'),
        onPress: onPressCancel,
      },
    ],
    {cancelable: false},
  );
};

export default logoutDialog;
