import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SegmentSelector from './SegmentSelector';
import {NotiificationIcon} from './SegmentSelector';
import {useDispatch, useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  StackActions: {
    push: jest.fn().mockReturnValue({type: 'PUSH'}),
  },
}));

jest.mock('../widgets/QPBottomSheet', () => ({
  QPBottomSheet: ({visible, children}) =>
    visible ? require('react').createElement('View', {testID: 'segment-sheet'}, children) : null,
  QPBottomSheetHeader: () => null,
}));

jest.mock('./selectSegmentScreen/SegmentSheetContent', () => ({
  SegmentSheetContent: () => null,
}));

describe('SegmentSelector Component', () => {
  const dispatch = jest.fn();
  const navigationDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatch);
    useNavigation.mockReturnValue({dispatch: navigationDispatch});
    useSelector.mockImplementation(selector =>
      selector({
        global: {authToken: 'dummy_token', userInfo: {userID: 'user123'}},
        dashboard: {
          segmentDetails: {segments: ['Segment 1', 'Segment 2']},
          currentSegment: {currentSegment: 'Segment 1', currentSegmentID: '1'},
          segmentList: [],
        },
        notification: {
          notificationLogs: [
            {id: 1, hasRead: false},
            {id: 2, hasRead: true},
          ],
        },
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with multiple segments', () => {
    const {getByText} = render(<SegmentSelector screenName="TestScreen" />);

    expect(getByText('Segment 1')).toBeTruthy();
  });

  it('should open bottom sheet on press when multiple segments', () => {
    const {getByText, getByTestId} = render(
      <SegmentSelector screenName="TestScreen" />,
    );

    fireEvent.press(getByText('Segment 1'));

    expect(getByTestId('segment-sheet')).toBeTruthy();
  });

  it('should dispatch getClosedLoopOwnerDetails when currentSegment changes', () => {
    render(<SegmentSelector screenName="TestScreen" />);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
      }),
    );
  });

  it('should render SegmentText without Pressable if only one segment', () => {
    useSelector.mockImplementationOnce(selector =>
      selector({
        global: {authToken: 'dummy_token', userInfo: {userID: 'user123'}},
        dashboard: {
          segmentDetails: {segments: ['Segment 1']},
          currentSegment: {currentSegment: 'Segment 1', currentSegmentID: '1'},
        },
      }),
    );

    const {getByText, queryByTestId} = render(
      <SegmentSelector screenName="TestScreen" />,
    );

    expect(getByText('Segment 1')).toBeTruthy();
    expect(queryByTestId('Pressable')).toBeNull();
  });
});
