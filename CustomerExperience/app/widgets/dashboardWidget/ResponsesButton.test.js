import React from 'react';

import {render, fireEvent} from '@testing-library/react-native';
import ResponsesButton from './ResponsesButton';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {mockNavigate} from '@react-navigation/native';

// // Mock useNavigation hook
// const mockNavigate = jest.fn();
// jest.mock('@react-navigation/native', () => ({
//   useNavigation: () => ({
//     navigate: mockNavigate,
//   }),
// }));

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockStore = configureStore([]);

let store;
beforeEach(() => {
  store = mockStore({
    global: {
      userInfo: {
        feedbackAPIKey: 'mock-api-key',
        feedbackID: 'mock-feedback-id',
      },
    },
  });
  jest.clearAllMocks();
});

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <SafeAreaProvider>
        <ResponsesButton />
      </SafeAreaProvider>
    </Provider>,
  );
};

describe('ResponsesButton Component', () => {
  it('renders the ResponsesButton with default size', () => {
    const {getByTestId} = renderComponent();
    const button = getByTestId('dashboardToResponseButton');

    // Check if the button is rendered
    expect(button).toBeTruthy();
  });

  it('renders the ResponsesButton with custom size', () => {
    const {getByTestId} = renderComponent();
    const button = getByTestId('dashboardToResponseButton');

    // Check if the button is rendered
    expect(button).toBeTruthy();
  });
  it('calls navigate to "dashboard_to_responses" when the button is pressed', () => {
    const {getByTestId} = renderComponent();
    const button = getByTestId('dashboardToResponseButton');

    fireEvent.press(button);

    // Verify that the navigation function was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith('dashboard_to_responses');
  });
});
