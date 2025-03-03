import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import RenderSegmentItem from './RenderSegmentItem';
import StringUtils from '../../Utils/StringUtils';

// Mock the FlatList component
jest.mock('react-native-gesture-handler', () => ({
  FlatList: jest.fn(
    ({data, renderItem, ListHeaderComponent, ListEmptyComponent}) => (
      <>
        {ListHeaderComponent}
        {data.map((item, index) => renderItem({item, index}))}
        {data.length === 0 && ListEmptyComponent}
      </>
    ),
  ),
}));

// Mock the useSelector hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('RenderSegmentItem Component', () => {
  const mockStore = configureStore([]);
  const mockOnClickRadioButton = jest.fn();
  const mockTitle = 'Segment';
  const mockCurrentSelected = '2';
  const mockSegments = [
    {segmentName: 'Segment 1', segmentID: '1'},
    {segmentName: 'Segment 2', segmentID: '2'},
    {segmentName: 'Segment 3', segmentID: '3'},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const {useSelector} = require('react-redux');
    useSelector.mockImplementation(selector =>
      selector({
        dashboard: {
          segmentDetails: {
            segments: mockSegments,
          },
        },
      }),
    );
  });

  it('renders the title correctly', () => {
    const {getByText} = render(
      <Provider store={mockStore({})}>
        <RenderSegmentItem
          onClickRadioButton={mockOnClickRadioButton}
          title={mockTitle}
          currentSelected={mockCurrentSelected}
        />
      </Provider>,
    );

    expect(getByText(mockTitle)).toBeTruthy();
  });

  it('renders CheckRadioButtonItems for each segment', () => {
    const {getByText} = render(
      <Provider store={mockStore({})}>
        <RenderSegmentItem
          onClickRadioButton={mockOnClickRadioButton}
          title={mockTitle}
          currentSelected={mockCurrentSelected}
        />
      </Provider>,
    );

    mockSegments.forEach(segment => {
      expect(getByText(segment.segmentName)).toBeTruthy();
    });
  });

  it('calls onClickRadioButton with correct arguments when a CheckRadioButtonItem is pressed', () => {
    const {getByText} = render(
      <Provider store={mockStore({})}>
        <RenderSegmentItem
          onClickRadioButton={mockOnClickRadioButton}
          title={mockTitle}
          currentSelected={mockCurrentSelected}
        />
      </Provider>,
    );

    fireEvent.press(getByText('Segment 1'));
    expect(mockOnClickRadioButton).toHaveBeenCalledWith(
      mockTitle,
      {title: 'Segment 1', id: '1', isChecked: false},
      0,
    );
  });

  it('does not call onClickRadioButton when isCurrentSegment is false', () => {
    const {getByText} = render(
      <Provider store={mockStore({})}>
        <RenderSegmentItem
          onClickRadioButton={mockOnClickRadioButton}
          title={mockTitle}
          currentSelected={mockCurrentSelected}
          isCurrentSegment={false}
        />
      </Provider>,
    );

    fireEvent.press(getByText('Segment 1'));
    expect(mockOnClickRadioButton).not.toHaveBeenCalled();
  });

  it('renders NoDataFound component when segments array is empty', () => {
    const {useSelector} = require('react-redux');
    useSelector.mockImplementation(selector =>
      selector({
        dashboard: {
          segmentDetails: {
            segments: [],
          },
        },
      }),
    );

    const {getByText} = render(
      <Provider store={mockStore({})}>
        <RenderSegmentItem
          onClickRadioButton={mockOnClickRadioButton}
          title={mockTitle}
          currentSelected={mockCurrentSelected}
        />
      </Provider>,
    );

    expect(
      getByText(
        StringUtils.uppercaseFirstCharRestLowercase(`No ${mockTitle} Found`),
      ),
    ).toBeTruthy();
  });
});
