import React from 'react';
import {
  wordsToBold,
  priorityList,
  statusList,
  statusListDashboardClosedLoopFilter,
  statusListForCreateTicket,
  ticketTypeList,
  getTicketTypeById,
  getStatusById,
  getPriorityById,
  getSegmentNameById,
  getOwnerNameById,
  getStatusIndexById,
  getPriorityIndexById,
  getSegmentIndex,
  getSegmentBySegmentId,
  getOwnerIndex,
  getDashboardStatusList,
  getDashboardStatusListForBottomList,
  getAllTicketCount,
  getUniqueValues,
  getNameInitials,
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

  test('should return the correct segment name by ID', () => {
    const segmentList = [
      {segmentID: 1, segmentName: 'Segment A'},
      {segmentID: 2, segmentName: 'Segment B'},
    ];
    expect(getSegmentNameById(segmentList, 1)).toBe('Segment A');
    expect(getSegmentNameById(segmentList, 2)).toBe('Segment B');
    expect(getSegmentNameById(segmentList, 99)).toBe('Segment'); // default case
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

  test('should return the correct segment by segment ID', () => {
    const segmentList = [
      {segmentID: 1, segmentName: 'Segment A'},
      {segmentID: 2, segmentName: 'Segment B'},
    ];
    expect(getSegmentBySegmentId(segmentList, 1)).toEqual({
      segmentID: 1,
      segmentName: 'Segment A',
    });
    expect(getSegmentBySegmentId(segmentList, 2)).toEqual({
      segmentID: 2,
      segmentName: 'Segment B',
    });
    expect(getSegmentBySegmentId(segmentList, 99)).toEqual({}); // default case
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

  test('should return the correct dashboard status list', () => {
    const ticketCount = {
      NEW: 5,
      OPEN: 10,
    };
    const result = getDashboardStatusList(ticketCount);
    expect(result).toHaveLength(3); // NEW, OPEN, and All
    expect(result[0].label).toBe('New');
    expect(result[1].label).toBe('Open');
    expect(result[2].label).toBe('All');
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

  test('should return the correct name initials', () => {
    expect(getNameInitials('John Doe')).toBe('JD');
    expect(getNameInitials('Alice')).toBe('Al');
    expect(getNameInitials('J')).toBe('J');
  });
});
