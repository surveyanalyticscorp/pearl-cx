import {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

const useKeyboardState = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardVisible(true);
      setKeyboardHeight(Platform.OS === 'ios' ? e.endCoordinates.height : 0);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => { keyboardDidShowListener.remove(); keyboardDidHideListener.remove(); };
  }, []);
  return {isKeyboardVisible, keyboardHeight};
};
export default useKeyboardState;
