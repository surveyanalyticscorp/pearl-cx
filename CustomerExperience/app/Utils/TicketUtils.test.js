import React from 'react';
import {
  wordsToBold,
  priorityList,
  statusList,
  statusListForCreateTicket,
  ticketTypeList,
  getTicketTypeById,
  getStatusById,
  getPriorityById,
  getOwnerNameById,
  getStatusIndexById,
  getPriorityIndexById,
  getSegmentIndex,
  getOwnerIndex,
  getDashboardStatusListForBottomList,
  getAllTicketCount,
  getUniqueValues,
  getNameInitials,
  convertDateToYMDFORMAT,
  getFilterCount,
  clearPriorityFilter,
  clearStatusFilter,
  clearTypeFilter,
  clearAssignToIdFilter,
  getIds,
  getNames,
  createFilterState,
  wait,
} from './TicketUtils';
import {ResponsesIcon, RenderStatusIcon} from '../routes/commonUI/CommonUI';
import StringUtils from './StringUtils';

jest.mock('../routes/commonUI/CommonUI', () => ({
  RenderStatusIcon: jest.fn(() => <div>RenderStatusIcon</div>),
  ResponsesIcon: jest.fn(() => <div>ResponsesIcon</div>),
}));

jest.mock('./StringUtils', () => ({
  uppercaseFirstCharRestLowercase: jest.fn(
    str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  ),
}));

describe('TicketUtils', () => {
  test('should contain predefined words for bold formatting', () => {
    expect(wordsToBold).toEqual([
      'HIGH',
      'LOW',
      'CRITICAL',
      'MEDIUM',
      'NEW',
      'OPEN',
      'RESOLVED',
      'ESCALATED',
      'overdue',
    ]);
  });

  test('should return the correct ticket type by ID', () => {
    expect(getTicketTypeById(0)).toBe('Manual ticket');
    expect(getTicketTypeById(1)).toBe('Detractor alert');
    expect(getTicketTypeById(99)).toBe('Manual ticket'); // default case
  });

  test('should return the correct status by ID', () => {
    expect(getStatusById(0)).toBe('New');
    expect(getStatusById(1)).toBe('Open');
    expect(getStatusById(3)).toBe('Resolved');
    expect(getStatusById(99)).toBe('New'); // default case
  });

  test('should return the correct priority by ID', () => {
    expect(getPriorityIndexById(0)).toBe(0); // Low
    expect(getPriorityIndexById(1)).toBe(1); // Medium
    expect(getPriorityIndexById(2)).toBe(2); // High
    expect(getPriorityIndexById(3)).toBe(3); // Critical
    expect(getPriorityIndexById(99)).toBe(-1); // not found
  });

  test('should return the correct owner name by ID', () => {
    const owners = [
      {ownerID: 1, ownerName: 'Owner A'},
      {ownerID: 2, ownerName: 'Owner B'},
    ];
    expect(getOwnerNameById(owners, 1)).toBe('Owner A');
    expect(getOwnerNameById(owners, 2)).toBe('Owner B');
    expect(getOwnerNameById(owners, 99)).toBe('Owner'); // default case
  });

  test('should return the correct status index by ID', () => {
    expect(getStatusIndexById(0)).toBe(0);
    expect(getStatusIndexById(1)).toBe(1);
    expect(getStatusIndexById(99)).toBe(-1); // not found
  });

  test('should return the correct priority index by ID', () => {
    expect(getPriorityIndexById(0)).toBe(0); // Low
    expect(getPriorityIndexById(1)).toBe(1); // Medium
    expect(getPriorityIndexById(2)).toBe(2); // High
    expect(getPriorityIndexById(3)).toBe(3); // Critical
    expect(getPriorityIndexById(99)).toBe(-1); // not found
  });
  test('should return the correct segment index by ID', () => {
    const segmentList = [
      {segmentID: 1, segmentName: 'Segment A'},
      {segmentID: 2, segmentName: 'Segment B'},
    ];
    expect(getSegmentIndex(segmentList, 1)).toBe(0);
    expect(getSegmentIndex(segmentList, 2)).toBe(1);
    expect(getSegmentIndex(segmentList, 99)).toBe(0); // default case
  });

  test('should return the correct owner index by ID', () => {
    const ownerList = [
      {ownerID: 1, ownerName: 'Owner A'},
      {ownerID: 2, ownerName: 'Owner B'},
    ];
    expect(getOwnerIndex(ownerList, 1)).toBe(0);
    expect(getOwnerIndex(ownerList, 2)).toBe(1);
    expect(getOwnerIndex(ownerList, 99)).toBe(-1); // not found
  });

  test('should return the correct dashboard status list for bottom list', () => {
    const ticketCount = {
      NEW: 5,
      OPEN: 10,
    };
    const result = getDashboardStatusListForBottomList(ticketCount);
    expect(result).toHaveLength(3); // All, NEW, and OPEN
    expect(result[0].label).toBe('All');
    expect(result[1].label).toBe('New');
    expect(result[2].label).toBe('Open');
  });

  test('should return the correct total ticket count', () => {
    const ticketCount = {
      status1: {count1: 1, count2: 2},
      status2: {count1: 3, count2: 4},
    };
    const result = getAllTicketCount(ticketCount);
    expect(result).toEqual({count1: 4, count2: 6});
  });

  test('should return unique values by key', () => {
    const arr = [
      {id: 1, value: 'a'},
      {id: 2, value: 'b'},
      {id: 1, value: 'c'},
    ];
    const result = getUniqueValues(arr, 'id');
    expect(result).toEqual([
      {id: 1, value: 'a'},
      {id: 2, value: 'b'},
    ]);
  });

  test('getUniqueValues should return empty array for null/undefined input', () => {
    expect(getUniqueValues(null, 'id')).toEqual([]);
    expect(getUniqueValues(undefined, 'id')).toEqual([]);
  });

  test('should return the correct name initials', () => {
    expect(getNameInitials('John Doe')).toBe('JD');
    expect(getNameInitials('Alice')).toBe('Al');
    expect(getNameInitials('J')).toBe('J');
  });

  test('getPriorityById should return the correct priority label by ID', () => {
    expect(getPriorityById(0)).toBe('Low');
    expect(getPriorityById(1)).toBe('Medium');
    expect(getPriorityById(2)).toBe('High');
    expect(getPriorityById(3)).toBe('Critical');
    expect(getPriorityById(99)).toBe('Low'); // default
  });

  test('getDashboardStatusListForBottomList should return empty array for null/undefined input', () => {
    expect(getDashboardStatusListForBottomList(null)).toEqual([]);
    expect(getDashboardStatusListForBottomList(undefined)).toEqual([]);
  });

  test('getDashboardStatusListForBottomList icon functions should be callable', () => {
    const result = getDashboardStatusListForBottomList({NEW: 5});
    expect(result[0].icon).toBeDefined();
    expect(result[1].icon).toBeDefined();
    expect(() => result[0].icon()).not.toThrow();
    expect(() => result[1].icon()).not.toThrow();
  });

  test('convertDateToYMDFORMAT should convert DD/MM/YYYY to YYYY/MM/DD', () => {
    expect(convertDateToYMDFORMAT('14/05/2026')).toBe('2026/05/14');
  });

  test('getFilterCount should count non-empty filter arrays', () => {
    const filterState = {
      status: '0,1',
      priority: '',
      type: '1',
      assignToId: '5',
    };
    expect(getFilterCount(filterState)).toBe(3);
  });

  test('getFilterCount should return 0 for empty filter state', () => {
    expect(
      getFilterCount({status: '', priority: '', type: '', assignToId: ''}),
    ).toBe(0);
  });

  test('getFilterCount should not count tags with empty arrays', () => {
    const filterState = {status: [], priority: [], type: [], assignToId: []};
    expect(getFilterCount(filterState)).toBe(0);
  });

  test('getFilterCount should skip tags not present in filterState', () => {
    expect(getFilterCount({})).toBe(0);
  });

  test('clearPriorityFilter should return priorityList with isChecked false', () => {
    const result = clearPriorityFilter();
    expect(result).toHaveLength(priorityList.length);
    result.forEach(item => expect(item.isChecked).toBe(false));
  });

  test('clearStatusFilter should return statusList with isChecked false', () => {
    const result = clearStatusFilter();
    expect(result).toHaveLength(statusList.length);
    result.forEach(item => expect(item.isChecked).toBe(false));
  });

  test('clearTypeFilter should return ticketTypeList with isChecked false', () => {
    const result = clearTypeFilter();
    expect(result).toHaveLength(ticketTypeList.length);
    result.forEach(item => expect(item.isChecked).toBe(false));
  });

  test('clearAssignToIdFilter should return an empty array', () => {
    expect(clearAssignToIdFilter()).toEqual([]);
  });

  test('getIds should return comma-separated ids of checked items', () => {
    const items = [
      {id: 1, isChecked: true},
      {id: 2, isChecked: false},
      {id: 3, isChecked: true},
    ];
    expect(getIds(items)).toBe('1,3');
  });

  test('getIds should return empty string when no items are checked', () => {
    const items = [{id: 1, isChecked: false}];
    expect(getIds(items)).toBe('');
  });

  test('getNames should return comma-separated names of checked items', () => {
    const items = [
      {name: 'Alice', isChecked: true},
      {name: 'Bob', isChecked: false},
      {name: 'Charlie', isChecked: true},
    ];
    expect(getNames(items)).toBe('Alice,Charlie');
  });

  test('getNames should return empty string when no items are checked', () => {
    const items = [{name: 'Alice', isChecked: false}];
    expect(getNames(items)).toBe('');
  });

  test('createFilterState should build a filter state from item and getIdsFunction', () => {
    const getIdsMock = jest.fn(items => items.join(','));
    const item = {
      status: ['0', '1'],
      priority: ['2'],
      type: ['0'],
      assignToId: '42',
      tags: [],
    };
    const result = createFilterState(item, getIdsMock);
    expect(result.pageNumber).toBe(1);
    expect(result.assignToId).toBe('42');
    expect(result.tags).toBe('');
  });

  test('createFilterState should fall back to empty string when getIdsFunction returns null', () => {
    const getIdsMock = jest.fn(() => null);
    const item = {status: [], priority: [], type: [], assignToId: '', tags: []};
    const result = createFilterState(item, getIdsMock);
    expect(result.status).toBe('');
    expect(result.priority).toBe('');
    expect(result.type).toBe('');
  });

  test('wait should resolve after the given timeout', async () => {
    jest.useFakeTimers();
    const promise = wait(100);
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBeUndefined();
    jest.useRealTimers();
  });
});
