import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import MarketingScreen from './MarketingScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {mockDispatch, StackActions} from '@react-navigation/native';

describe('MarketingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      <SafeAreaProvider>
        <MarketingScreen />
      </SafeAreaProvider>,
    );
    expect(getByTestId('imageBackground')).toBeTruthy();
  });

  it('calls onPress and navigates to Login', () => {
    const {getByTestId} = render(
      <SafeAreaProvider>
        <MarketingScreen navigation={{dispatch: mockDispatch}} />
      </SafeAreaProvider>,
    );

    const getStartedButton = getByTestId('getStartedButton');
    fireEvent.press(getStartedButton);

    // Check that `dispatch` was called with the correct StackAction
    expect(mockDispatch).toHaveBeenCalledWith(StackActions.push('Login'));
  });
});
