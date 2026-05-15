import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useDraftGeneration from './useDraftGeneration';

jest.mock('../../../../redux/actions/closedloop.actions', () => ({
  generateEmailDraft: jest.fn(params => ({
    type: 'GENERATE_EMAIL_DRAFT',
    params,
  })),
  generateRefineEmailDraft: jest.fn(params => ({
    type: 'GENERATE_REFINE_EMAIL_DRAFT',
    params,
  })),
}));

const mockStore = configureStore([]);

const makeStore = (overrides = {}) =>
  mockStore({
    dashboard: {
      generatedEmailDraftResponse: {response: null, context: null},
      ticket: {id: 'ticket-1', panelMember: {name: 'John'}},
      ...overrides,
    },
    global: {userInfo: {feedbackID: 'fb-1'}},
  });

const wrapper = store =>
  ({children}) =>
    <Provider store={store}>{children}</Provider>;

describe('useDraftGeneration', () => {
  it('dispatches generateEmailDraft on mount', () => {
    const store = makeStore();
    renderHook(() => useDraftGeneration(), {wrapper: wrapper(store)});
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GENERATE_EMAIL_DRAFT'}),
    );
  });

  it('isLoading is true after mount (getEmailDraft was called)', () => {
    const store = makeStore();
    const {result} = renderHook(() => useDraftGeneration(), {
      wrapper: wrapper(store),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('sets currentDraft when response and context arrive', () => {
    const mockResponse = {refine: 'formal', subject: 'Hi', body: 'Hello'};
    const store = makeStore({
      generatedEmailDraftResponse: {
        response: mockResponse,
        context: 'ctx',
      },
    });
    const {result} = renderHook(() => useDraftGeneration(), {
      wrapper: wrapper(store),
    });
    expect(result.current.currentDraft).toEqual(mockResponse);
  });

  it('getRefinedEmailDraft dispatches refine action', () => {
    const store = makeStore();
    const {result} = renderHook(() => useDraftGeneration(), {
      wrapper: wrapper(store),
    });
    act(() => {
      result.current.getRefinedEmailDraft(
        {refine: 'Formal', intent: 'Apologize'},
        'ctx',
        'Subject',
        'Body',
      );
    });
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GENERATE_REFINE_EMAIL_DRAFT'}),
    );
  });

  it('getEmailDraft dispatches generateEmailDraft', () => {
    const store = makeStore();
    const {result} = renderHook(() => useDraftGeneration(), {
      wrapper: wrapper(store),
    });
    store.clearActions();
    act(() => {
      result.current.getEmailDraft();
    });
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GENERATE_EMAIL_DRAFT'}),
    );
  });
});
