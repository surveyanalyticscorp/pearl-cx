import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useEmailBody from './useEmailBody';

const mockStore = configureStore([]);

const makeStore = (defaultTemplate = {}) =>
  mockStore({
    dashboard: {emailData: {defaultTemplate}},
  });

const mockRichTextRef = {current: {setContentHTML: jest.fn()}};

const wrapper = store =>
  ({children}) =>
    <Provider store={store}>{children}</Provider>;

describe('useEmailBody', () => {
  beforeEach(() => jest.clearAllMocks());

  it('initializes body with ticketId and toEmail', () => {
    const store = makeStore();
    const {result} = renderHook(
      () => useEmailBody('T1', 'user@test.com', mockRichTextRef),
      {wrapper: wrapper(store)},
    );
    expect(result.current.body.ticketId).toBe('T1');
    expect(result.current.body.toEmail).toBe('user@test.com');
    expect(result.current.body.subject).toBe('');
    expect(result.current.body.emailBody).toBe('');
  });

  it('onChangeSubject updates subject', () => {
    const store = makeStore();
    const {result} = renderHook(
      () => useEmailBody('T1', 'user@test.com', mockRichTextRef),
      {wrapper: wrapper(store)},
    );
    act(() => result.current.onChangeSubject('New Subject'));
    expect(result.current.body.subject).toBe('New Subject');
  });

  it('onChangeEmailBody updates emailBody', () => {
    const store = makeStore();
    const {result} = renderHook(
      () => useEmailBody('T1', 'user@test.com', mockRichTextRef),
      {wrapper: wrapper(store)},
    );
    act(() => result.current.onChangeEmailBody('<p>Hello</p>'));
    expect(result.current.body.emailBody).toBe('<p>Hello</p>');
  });

  it('clears emailBody and editor when defaultTemplate changes to non-empty', () => {
    const store = makeStore({templateText: '<p>Template</p>'});
    renderHook(
      () => useEmailBody('T1', 'user@test.com', mockRichTextRef),
      {wrapper: wrapper(store)},
    );
    expect(mockRichTextRef.current.setContentHTML).toHaveBeenCalledWith('');
  });
});
