import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AppSettings from './AppSettings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {translate} from '../../Utils/MultilinguaUtils';
import {NavigationContainer} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockStore = configureStore([]);
const initialState = {
  global: {
    userInfo: {firstName: 'John', lastName: 'Doe', email: 'john@example.com'},
  },
};

describe('AppSettings', () => {
  let store;
  let navigationMock;

  beforeEach(() => {
    store = mockStore(initialState);
    navigationMock = {navigate: jest.fn()};
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppSettings navigation={navigationMock} />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>,
    );

  it('renders AppSettings component correctly', () => {
    const {getByText, getByTestId} = renderComponent();

    // Check that the account details row is rendered with the correct text
    expect(getByText(translate('settings.account_details'))).toBeTruthy();
  });

  it('navigates to account details screen when row is pressed', () => {
    const {getByText} = renderComponent();

    // Find the account details row and trigger a press event
    const accountDetailsRow = getByText(translate('settings.account_details'));
    fireEvent.press(accountDetailsRow);

    // Check that navigation was called with the correct arguments
    expect(navigationMock.navigate).toHaveBeenCalledWith(
      translate('settings.account_details'),
      {userInfo: initialState.global.userInfo},
    );
  });

  it('renders the correct icon and chevron for each row', () => {
    const {getByTestId} = renderComponent();

    // Find the account details row and check the icon and chevron
    const accountIcon = getByTestId('icon-account');
    const chevronIcon = getByTestId('icon-chevron-right');

    expect(accountIcon).toBeTruthy();
    expect(chevronIcon).toBeTruthy();
  });
});
