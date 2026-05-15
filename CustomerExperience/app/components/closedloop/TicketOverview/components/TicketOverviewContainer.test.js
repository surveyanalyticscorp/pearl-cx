import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketOverviewContainer from './TicketOverviewContainer';

jest.mock('../../../../routes/commonUI/CommonUI', () => ({
  RenderSpinner: () => {
    const {View} = require('react-native');
    return <View testID="spinner" />;
  },
}));

const mockStore = configureStore([]);
const buildStore = (isTicketLoading = false) =>
  mockStore({global: {isTicketLoading}});

describe('TicketOverviewContainer', () => {
  it('renders children when not loading', () => {
    const {getByTestId, getByText} = render(
      <Provider store={buildStore(false)}>
        <TicketOverviewContainer>
          <Text>Child content</Text>
        </TicketOverviewContainer>
      </Provider>,
    );
    expect(getByTestId('ticket-overview')).toBeTruthy();
    expect(getByText('Child content')).toBeTruthy();
  });

  it('renders spinner when loading', () => {
    const {getByTestId, queryByTestId} = render(
      <Provider store={buildStore(true)}>
        <TicketOverviewContainer>
          <Text>Child content</Text>
        </TicketOverviewContainer>
      </Provider>,
    );
    expect(getByTestId('spinner')).toBeTruthy();
    expect(queryByTestId('ticket-overview')).toBeNull();
  });
});
