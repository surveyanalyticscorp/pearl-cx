import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useSendEmail from './useSendEmail';

jest.mock('../EmailEditorContext', () => ({
  useEmailEditor: () => ({blurEditor: jest.fn()}),
}));

jest.mock('../../../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockStore = configureStore([]);
const makeStore = (mediaFileList = []) =>
  mockStore({dashboard: {mediaFileList}});

const wrapper = (mediaFileList) => ({children}) => (
  <Provider store={makeStore(mediaFileList)}>{children}</Provider>
);

describe('useSendEmail', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns handleSend function', () => {
    const {result} = renderHook(
      () => useSendEmail({subject: 'S', emailBody: 'B', ticketId: 1}),
      {wrapper: wrapper([])},
    );
    expect(typeof result.current.handleSend).toBe('function');
  });

  it('shows error when subject is empty', () => {
    const {showErrorFlashMessage} = require('../../../../Utils/Utility');
    const {result} = renderHook(
      () => useSendEmail({subject: '', emailBody: 'B', ticketId: 1}),
      {wrapper: wrapper([])},
    );
    act(() => result.current.handleSend());
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Empty email subject');
  });

  it('shows error when body is empty', () => {
    const {showErrorFlashMessage} = require('../../../../Utils/Utility');
    const {result} = renderHook(
      () => useSendEmail({subject: 'Subject', emailBody: '', ticketId: 1}),
      {wrapper: wrapper([])},
    );
    act(() => result.current.handleSend());
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Empty email body');
  });

  it('dispatches sendEmail when subject and body are provided', () => {
    const {result} = renderHook(
      () => useSendEmail({subject: 'Hello', emailBody: '<p>Body</p>', ticketId: 5}),
      {wrapper: wrapper([{id: 'file1'}])},
    );
    act(() => result.current.handleSend());
    expect(mockDispatch).toHaveBeenCalled();
  });
});
