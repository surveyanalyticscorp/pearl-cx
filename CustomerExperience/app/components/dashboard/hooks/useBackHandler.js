import {useState, useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';
import {translate} from '../../../Utils/MultilinguaUtils';

const useBackHandler = navigation => {
  const [exitAlert, setExitAlert] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        } else {
          setExitAlert(true);
          return true;
        }
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const renderExitAlert = () => {
    if (exitAlert) {
      Alert.alert(
        translate('exit_app'),
        translate('exit_message'),
        [
          {
            text: translate('yes'),
            onPress: () => {
              setExitAlert(false);
              BackHandler.exitApp();
            },
          },
          {
            text: translate('no'),
            onPress: () => setExitAlert(false),
          },
        ],
        {cancelable: false},
      );
    }
  };

  return {renderExitAlert, exitAlert};
};

export default useBackHandler;
