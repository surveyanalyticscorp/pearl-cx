import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useTicketFilter from './useTicketFilter';

const mockStore = configureStore([]);

const baseState = {
  global: {
    userInfo: {feedbackApiKey: 'fak1', userID: 123},
    range: {startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31')},
    statusId: null,
  },
  dashboard: {
    ownerDetails: {owners: []},
    ticketFilter: null,
    ticketTags: [],
  },
};

const makeStore = (overrides = {}) =>
  mockStore({
    ...baseState,
    ...overrides,
    global: {...baseState.global, ...(overrides.global ?? {})},
    dashboard: {...baseState.dashboard, ...(overrides.dashboard ?? {})},
  });

const wrapper = (overrides) => ({children}) => (
  <Provider store={makeStore(overrides)}>{children}</Provider>
);

describe('useTicketFilter', () => {
  it('returns filterState with feedbackApiKey from store', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    expect(result.current.filterState.feedbackApiKey).toBe('fak1');
  });

  it('returns empty filterData.managers initially when no owners', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    expect(result.current.filterData.managers).toEqual([]);
  });

  it('populates managers from owners in store', () => {
    const owners = [{ownerID: 1, name: 'Alice'}, {ownerID: 2, name: 'Bob'}];
    const {result} = renderHook(
      () => useTicketFilter(),
      {wrapper: wrapper({dashboard: {ownerDetails: {owners}, ticketFilter: null, ticketTags: []}})},
    );
    expect(result.current.filterData.managers).toHaveLength(2);
  });

  it('restores filterData from savedFilterData in store', () => {
    const savedFilter = {
      status: [{id: 0, title: 'New', isChecked: true}],
      priority: [{id: 0, title: 'Low', isChecked: false}],
      type: [{id: 0, title: 'Manual', isChecked: false}],
      assignToId: '123',
    };
    const {result} = renderHook(
      () => useTicketFilter(),
      {wrapper: wrapper({dashboard: {ownerDetails: {owners: []}, ticketFilter: savedFilter, ticketTags: []}})},
    );
    expect(result.current.filterData.status[0].isChecked).toBe(true);
  });

  it('applyFilter updates filterData and dispatches saveTicketFilterData', () => {
    const store = makeStore();
    const w = ({children}) => <Provider store={store}>{children}</Provider>;
    const {result} = renderHook(() => useTicketFilter(), {wrapper: w});
    const newFilter = {
      status: [{id: 0, title: 'New', isChecked: true}],
      priority: [],
      type: [],
      assignToId: '',
      tags: [],
    };
    act(() => result.current.applyFilter(newFilter));
    const actions = store.getActions();
    expect(actions.some(a => a.type === 'SAVE_TICKET_FILTER_DATA')).toBe(true);
  });

  it('resetFilter dispatches clearTicketFilterData and clearTagFilter', () => {
    const store = makeStore();
    const w = ({children}) => <Provider store={store}>{children}</Provider>;
    const {result} = renderHook(() => useTicketFilter(), {wrapper: w});
    act(() => result.current.resetFilter());
    const actions = store.getActions();
    expect(actions.some(a => a.type === 'CLEAR_TICKET_FILTER_DATA')).toBe(true);
    expect(actions.some(a => a.type === 'CLEAR_TAG_FILTER')).toBe(true);
  });

  it('submitQuery updates filterState search', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    act(() => result.current.submitQuery('hello'));
    expect(result.current.filterState.search).toBe('hello');
  });

  it('onResetSearch clears search text', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    act(() => result.current.submitQuery('test'));
    act(() => result.current.onResetSearch());
    expect(result.current.filterState.search).toBe('');
  });

  it('clearFilterData returns empty array for unknown item', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    const cleared = result.current.clearFilterData('unknown');
    expect(cleared).toEqual([]);
  });

  it('getOwnerIds returns comma-separated checked owner IDs', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    const owners = [
      {ownerID: 1, isChecked: true},
      {ownerID: 2, isChecked: false},
      {ownerID: 3, isChecked: true},
    ];
    const ids = result.current.getOwnerIds(owners);
    expect(ids).toBe('1,3');
  });

  it('filterByStatus marks matching status as checked in filterData', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper({global: {statusId: '0'}})});
    expect(result.current.filterData.status.find(s => s.id === 0)?.isChecked).toBe(true);
    expect(result.current.filterState.status).toBe('0');
  });

  it('filterByStatus does not check status when statusId is null', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper({global: {statusId: null}})});
    expect(result.current.filterData.status.every(s => !s.isChecked)).toBe(true);
  });

  it('resetFilterState updates only dates without clearing filter selections', () => {
    const {result} = renderHook(() => useTicketFilter(), {wrapper: wrapper()});
    act(() => result.current.applyFilter({
      status: [{id: 0, title: 'New', isChecked: true}],
      priority: [],
      type: [],
      assignToId: '',
      tags: [],
    }));
    const newRange = {startDate: new Date('2025-03-01'), endDate: new Date('2025-03-31')};
    act(() => result.current.resetFilterState(newRange));
    expect(result.current.filterState.fromDate).toBe('2025/03/01');
    expect(result.current.filterState.toDate).toBe('2025/03/31');
    expect(result.current.filterState.pageNumber).toBe(1);
  });

  it('resetFilter with range updates fromDate and toDate', () => {
    const store = makeStore();
    const w = ({children}) => <Provider store={store}>{children}</Provider>;
    const {result} = renderHook(() => useTicketFilter(), {wrapper: w});
    const newRange = {startDate: new Date('2025-06-01'), endDate: new Date('2025-06-30')};
    act(() => result.current.resetFilter(newRange));
    expect(result.current.filterState.fromDate).toBe('2025/06/01');
    expect(result.current.filterState.toDate).toBe('2025/06/30');
  });
});
