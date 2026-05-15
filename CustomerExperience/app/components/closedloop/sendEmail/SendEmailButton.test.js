import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import SendEmailButton from './SendEmailButton';

jest.mock('../../../Utils/IconUtils', () => ({IonIcon: () => null}));
const mockHandleSend = jest.fn();
jest.mock('./hooks/useSendEmail', () => () => ({handleSend: mockHandleSend}));

const mockStore = configureStore([]);

describe('SendEmailButton', () => {
  it('renders without crashing', () => {
    const store = mockStore({});
    const {toJSON} = render(
      <Provider store={store}>
        <SendEmailButton emailBody={{subject: '', emailBody: ''}} />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls handleSend on press', () => {
    const store = mockStore({});
    const {UNSAFE_getByType} = render(
      <Provider store={store}>
        <SendEmailButton emailBody={{subject: 'Sub', emailBody: 'Body'}} />
      </Provider>,
    );
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(mockHandleSend).toHaveBeenCalled();
  });
});
