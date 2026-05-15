import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import SelectSegment from './SelectSegment';

const mockStore = configureStore([]);

describe('SelectSegment Component', () => {
  const mockData = [
    {segmentName: 'Segment 1'},
    {segmentName: 'Segment 2'},
    {segmentName: 'Segment 3'},
  ];

  const mockHandleOnPress = jest.fn();

  const makeStore = (segments = mockData) =>
    mockStore({dashboard: {segmentList: segments}});
  const wrap = (ui, segments) =>
    <Provider store={makeStore(segments)}>{ui}</Provider>;

  it('renders SelectSegment component correctly', () => {
    const {getByText} = render(
      wrap(
        <SelectSegment
          data={mockData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
        />,
      ),
    );

    // Ensure all segment names are rendered
    expect(getByText('Segment 1')).toBeTruthy();
    expect(getByText('Segment 2')).toBeTruthy();
    expect(getByText('Segment 3')).toBeTruthy();
  });

  it('calls handleOnPress when a segment is pressed', () => {
    const {getAllByTestId} = render(
      wrap(
        <SelectSegment
          data={mockData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
        />,
      ),
    );

    // Press the second segment
    const segmentButtons = getAllByTestId('select-segment-button');
    fireEvent.press(segmentButtons[1]);

    // Expect the mock function to have been called with the correct arguments
    expect(mockHandleOnPress).toHaveBeenCalledWith(
      {segmentName: 'Segment 2'},
      1,
    );
  });

  it('displays a checkmark icon for the selected segment', () => {
    const {getAllByTestId, queryByTestId} = render(
      wrap(
        <SelectSegment
          data={mockData}
          selectedIndex={1}
          handleOnPress={mockHandleOnPress}
        />,
      ),
    );

    // Check that only the second segment has the checkmark icon
    const segmentButtons = getAllByTestId('select-segment-button');
    expect(queryByTestId('checkmark-icon-0')).toBeNull();
    expect(segmentButtons[1]).toContainElement(
      queryByTestId('checkmark-icon-1'),
    );
  });

  it('updates the selected index when a new segment is pressed', () => {
    const {getAllByTestId, queryByTestId} = render(
      wrap(
        <SelectSegment
          data={mockData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
        />,
      ),
    );

    const segmentButtons = getAllByTestId('select-segment-button');

    // Press the third segment
    fireEvent.press(segmentButtons[2]);

    // Check that the third segment now has the checkmark icon
    expect(queryByTestId('checkmark-icon-2')).toBeTruthy();
    expect(queryByTestId('checkmark-icon-0')).toBeNull();
  });
});
