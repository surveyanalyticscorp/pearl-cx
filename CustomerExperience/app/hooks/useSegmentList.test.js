import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useSegmentList from './useSegmentList';

jest.mock('../redux/actions/dashboard.actions', () => ({
  getClosedLoopSegmentDetails: jest.fn((token, params) => ({
    type: 'GET_CLOSED_LOOP_SEGMENT_DETAILS',
    token,
    params,
  })),
}));

const mockStore = configureStore([]);

const makeStore = (segmentList = []) =>
  mockStore({
    global: {authToken: 'tok', userInfo: {userID: 'u1'}},
    dashboard: {segmentList},
  });

const wrapper = store =>
  ({children}) =>
    <Provider store={store}>{children}</Provider>;

describe('useSegmentList', () => {
  it('dispatches segment fetch on mount', () => {
    const store = makeStore();
    renderHook(() => useSegmentList(), {wrapper: wrapper(store)});
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GET_CLOSED_LOOP_SEGMENT_DETAILS'}),
    );
  });

  it('returns segmentList from store', () => {
    const segments = [{segmentID: '1', segmentName: 'Seg A'}];
    const store = makeStore(segments);
    const {result} = renderHook(() => useSegmentList(), {
      wrapper: wrapper(store),
    });
    expect(result.current.segmentList).toEqual(segments);
  });

  it('onSearchHandler triggers new fetch with search text', () => {
    const store = makeStore();
    const {result} = renderHook(() => useSegmentList(), {
      wrapper: wrapper(store),
    });
    store.clearActions();
    act(() => result.current.onSearchHandler('Acme'));
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'GET_CLOSED_LOOP_SEGMENT_DETAILS',
        params: expect.objectContaining({segmentName: 'Acme'}),
      }),
    );
  });

  it('refresh triggers new fetch with default params', () => {
    const store = makeStore();
    const {result} = renderHook(() => useSegmentList(), {
      wrapper: wrapper(store),
    });
    store.clearActions();
    act(() => result.current.refresh());
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GET_CLOSED_LOOP_SEGMENT_DETAILS'}),
    );
  });
});
