import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {MarketingScreen} from '../MarketingScreen';
import {getMarketingScreenContent} from '../marketingContent';
import {SafeAreaProvider} from 'react-native-safe-area-context';

describe('MarketingScreen', () => {
  const renderComponent = () =>
    render(
      <SafeAreaProvider>
        <MarketingScreen navigation={mockNavigation} />{' '}
      </SafeAreaProvider>,
    );
  const mockNavigation = {
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('marketing-screen')).toBeTruthy();
    expect(getByTestId('marketing-swiper')).toBeTruthy();
    expect(getByTestId('get-started-button')).toBeTruthy();
  });

  it('navigates to Login screen when Get Started is pressed', () => {
    const {getByTestId} = renderComponent();
    fireEvent.press(getByTestId('get-started-button'));
    expect(mockNavigation.dispatch).toHaveBeenCalled();
  });

  it('renders correct number of intro pages', () => {
    const {getAllByTestId} = renderComponent();
    // Add appropriate testID to IntroPage and test
    expect(getMarketingScreenContent().length).toBe(4);
    expect(getAllByTestId('introTitle').length).toBe(4);
    expect(getAllByTestId('introDescription').length).toBe(4);
    expect(getAllByTestId('introImage').length).toBe(4);
  });
});
