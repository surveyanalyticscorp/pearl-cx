import React from 'react';
import {render} from '@testing-library/react-native';
import TicketComments from './TicketComments';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

const mockStore = configureStore([]);

describe('TicketComments', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      global: {
        userInfo: {
          emailAddress: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userID: '12345',
        },
      },
      dashboard: {
        parentComment: 'This is a parent comment',
        ticket: {
          id: 6999,
        },
      },
    });
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketComments />
      </Provider>,
    );

    // Add any additional assertions or interactions here
    expect(getByTestId('ticket-comments')).toBeTruthy(); // Adjust this to your actual testId
  });
});
