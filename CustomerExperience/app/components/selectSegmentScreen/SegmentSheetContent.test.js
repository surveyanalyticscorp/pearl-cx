import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {SegmentSheetContent} from './SegmentSheetContent';

const mockSegmentList = [
  {segmentID: '1', segmentName: 'Segment A'},
  {segmentID: '2', segmentName: 'Segment B'},
];

const mockRefresh = jest.fn();
const mockOnSearchHandler = jest.fn();

jest.mock('../../hooks/useSegmentList', () => () => ({
  segmentList: mockSegmentList,
  onSearchHandler: mockOnSearchHandler,
  refresh: mockRefresh,
}));

jest.mock('../../routes/commonUI/CheckmarkIcon', () => ({index}) => {
  const {View} = require('react-native');
  return <View testID={`checkmark-icon-${index}`} />;
});

jest.mock('../../routes/commonUI/CommonUI', () => ({
  NoItemsFound: ({children}) => {
    const {Text} = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'IonIcons');
jest.mock('../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));

describe('SegmentSheetContent', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders segment list', () => {
    const {getByText} = render(
      <SegmentSheetContent currentSegmentId="1" onSelect={mockOnSelect} />,
    );
    expect(getByText('Segment A')).toBeTruthy();
    expect(getByText('Segment B')).toBeTruthy();
  });

  it('calls onSelect and refresh when a segment is pressed', () => {
    const {getByText} = render(
      <SegmentSheetContent currentSegmentId="1" onSelect={mockOnSelect} />,
    );
    fireEvent.press(getByText('Segment B'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockSegmentList[1]);
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('shows checkmark for current segment', () => {
    const {getByTestId} = render(
      <SegmentSheetContent currentSegmentId="1" onSelect={mockOnSelect} />,
    );
    expect(getByTestId('checkmark-icon-0')).toBeTruthy();
  });

  it('calls onSearchHandler when search is submitted', () => {
    const {getByTestId} = render(
      <SegmentSheetContent currentSegmentId="1" onSelect={mockOnSelect} />,
    );
    fireEvent.changeText(getByTestId('search-input'), 'Seg');
    fireEvent(getByTestId('search-input'), 'submitEditing', {
      nativeEvent: {text: 'Seg'},
    });
    expect(mockOnSearchHandler).toHaveBeenCalledWith('Seg');
  });

  it('renders search input', () => {
    const {getByTestId} = render(
      <SegmentSheetContent currentSegmentId="1" onSelect={mockOnSelect} />,
    );
    expect(getByTestId('search-input')).toBeTruthy();
  });
});
