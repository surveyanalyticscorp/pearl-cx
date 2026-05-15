import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import EmailOptions from './EmailOptions';

jest.mock('./TicketId', () => () => null);
jest.mock('./TemplateIcon', () => ({onPressTemplate}) => {
  const {Pressable} = require('react-native');
  return <Pressable onPress={onPressTemplate} testID="template-icon" />;
});
jest.mock('./AttachmentUploadIcon', () => () => null);
jest.mock('./SendEmailButton', () => () => null);
jest.mock('./AiDraftButton', () => ({onPress}) => {
  const {Pressable} = require('react-native');
  return <Pressable onPress={onPress} testID="ai-draft-button" />;
});

const mockStore = configureStore([]);

describe('EmailOptions', () => {
  const store = mockStore({dashboard: {ticket: {id: 1}}});

  it('renders without crashing', () => {
    const {toJSON} = render(
      <Provider store={store}>
        <EmailOptions
          onPressAiButton={jest.fn()}
          onPressTemplate={jest.fn()}
          body={{subject: '', emailBody: ''}}
        />
      </Provider>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls onPressAiButton when AI button pressed', () => {
    const onPressAiButton = jest.fn();
    const {getByTestId} = render(
      <Provider store={store}>
        <EmailOptions
          onPressAiButton={onPressAiButton}
          onPressTemplate={jest.fn()}
          body={{subject: '', emailBody: ''}}
        />
      </Provider>,
    );
    fireEvent.press(getByTestId('ai-draft-button'));
    expect(onPressAiButton).toHaveBeenCalled();
  });

  it('calls onPressTemplate when template icon pressed', () => {
    const onPressTemplate = jest.fn();
    const {getByTestId} = render(
      <Provider store={store}>
        <EmailOptions
          onPressAiButton={jest.fn()}
          onPressTemplate={onPressTemplate}
          body={{subject: '', emailBody: ''}}
        />
      </Provider>,
    );
    fireEvent.press(getByTestId('template-icon'));
    expect(onPressTemplate).toHaveBeenCalled();
  });
});
