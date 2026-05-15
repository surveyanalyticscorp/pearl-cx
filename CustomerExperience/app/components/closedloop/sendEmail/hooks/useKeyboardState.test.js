import {renderHook, act} from '@testing-library/react-native';
import {Keyboard, Platform} from 'react-native';
import useKeyboardState from './useKeyboardState';

describe('useKeyboardState', () => {
  let showCallback;
  let hideCallback;
  let addListenerSpy;

  beforeEach(() => {
    addListenerSpy = jest.spyOn(Keyboard, 'addListener').mockImplementation(
      (event, cb) => {
        if (event === 'keyboardDidShow') showCallback = cb;
        if (event === 'keyboardDidHide') hideCallback = cb;
        return {remove: jest.fn()};
      },
    );
  });

  afterEach(() => {
    addListenerSpy.mockRestore();
  });

  it('initializes with keyboard hidden and zero height', () => {
    const {result} = renderHook(() => useKeyboardState());
    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });

  it('sets keyboardVisible true on keyboardDidShow', () => {
    const {result} = renderHook(() => useKeyboardState());
    act(() => showCallback({endCoordinates: {height: 300}}));
    expect(result.current.isKeyboardVisible).toBe(true);
  });

  it('resets keyboardVisible on keyboardDidHide', () => {
    const {result} = renderHook(() => useKeyboardState());
    act(() => showCallback({endCoordinates: {height: 300}}));
    act(() => hideCallback());
    expect(result.current.isKeyboardVisible).toBe(false);
  });
});
