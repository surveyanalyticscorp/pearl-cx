import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import AccountDetails from './AccountDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ASYNC_USER_CREDENTIALS} from '../../api/Constant';

const mockUserInfo = {
  firstName: 'John',
  lastName: 'Doe',
  organizationName: 'OpenAI',
};
const mockCredentials = {
  email: 'johndoe@example.com',
};

describe('AccountDetails', () => {
  const createTestProps = props => ({
    route: {
      params: {
        userInfo: mockUserInfo,
      },
    },
    ...props,
  });

  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockCredentials));
  });

  const renderComponent = props =>
    render(
      <SafeAreaProvider>
        <AccountDetails {...props} />
      </SafeAreaProvider>,
    );

  it('renders AccountDetails component correctly', async () => {
    const props = createTestProps({});
    const {getByTestId} = renderComponent(props);

    await waitFor(() => {
      expect(getByTestId('account-details')).toBeTruthy();
      expect(getByTestId('account-details-view')).toBeTruthy();
    });
  });

  it('fetches and sets user credentials from AsyncStorage', async () => {
    const props = createTestProps({});
    const {getByText} = renderComponent(props);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ASYNC_USER_CREDENTIALS);
      expect(getByText(mockCredentials.email)).toBeTruthy();
    });
  });

  it('renders user information correctly', async () => {
    const props = createTestProps({});
    const {getByText, getByTestId} = renderComponent(props);

    await waitFor(() => {
      expect(getByTestId('render-card')).toBeTruthy();
      // Check first and last name from route params
      expect(
        getByText(`${mockUserInfo.firstName} ${mockUserInfo.lastName}`),
      ).toBeTruthy();
      // Check email from AsyncStorage
      expect(getByText(mockCredentials.email)).toBeTruthy();
      // Check organization name from route params
      expect(getByText(mockUserInfo.organizationName)).toBeTruthy();
    });
  });
});
