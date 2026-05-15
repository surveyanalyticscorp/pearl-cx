import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import SendEmailTo from './SendEmailTo';

jest.mock('../../../Utils/MultilinguaUtils', () => ({translate: k => k}));

const mockStore = configureStore([]);

describe('SendEmailTo', () => {
  it('renders the recipient email from Redux state', () => {
    const store = mockStore({
      dashboard: {ticket: {panelMember: {email: 'user@example.com'}}},
    });
    const {getByText} = render(
      <Provider store={store}>
        <SendEmailTo />
      </Provider>,
    );
    expect(getByText('user@example.com')).toBeTruthy();
    expect(getByText('action_email.to')).toBeTruthy();
  });

  it('renders empty string when email is null', () => {
    const store = mockStore({
      dashboard: {ticket: {panelMember: {email: null}}},
    });
    const {getByText} = render(
      <Provider store={store}>
        <SendEmailTo />
      </Provider>,
    );
    expect(getByText('action_email.to')).toBeTruthy();
  });

  it('renders empty string when panelMember is undefined', () => {
    const store = mockStore({dashboard: {ticket: {}}});
    const {getByText} = render(
      <Provider store={store}>
        <SendEmailTo />
      </Provider>,
    );
    expect(getByText('action_email.to')).toBeTruthy();
  });
});
