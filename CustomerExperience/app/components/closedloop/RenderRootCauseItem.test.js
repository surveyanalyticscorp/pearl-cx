import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RenderRootCauseItem from './RenderRootCauseItem';
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

describe('RenderRootCauseItem Component', () => {
  const mockOnClickCheckBox = jest.fn();
  const mockTitle = 'Root Cause';
  const mockData = [
    {id: 1, title: 'Root Cause 1'},
    {id: 2, title: 'Root Cause 2'},
  ];

  it('renders the title correctly', () => {
    const {getByText} = render(
      <RenderRootCauseItem
        onClickCheckBox={mockOnClickCheckBox}
        title={mockTitle}
        data={mockData}
      />,
    );

    expect(getByText(mockTitle)).toBeTruthy();
  });

  it('renders CheckBoxItems for each data item', () => {
    const {getByText} = render(
      <RenderRootCauseItem
        onClickCheckBox={mockOnClickCheckBox}
        title={mockTitle}
        data={mockData}
      />,
    );

    mockData.forEach(item => {
      expect(getByText(item.title)).toBeTruthy();
    });
  });

  it('calls onClickCheckBox with correct arguments when a CheckBoxItem is pressed', () => {
    const {getByText} = render(
      <RenderRootCauseItem
        onClickCheckBox={mockOnClickCheckBox}
        title={mockTitle}
        data={mockData}
      />,
    );

    fireEvent.press(getByText('Root Cause 1'));
    expect(mockOnClickCheckBox).toHaveBeenCalledWith(mockTitle, mockData[0], 0);

    fireEvent.press(getByText('Root Cause 2'));
    expect(mockOnClickCheckBox).toHaveBeenCalledWith(mockTitle, mockData[1], 1);
  });

  it('renders NoDataFound component when data is empty', () => {
    const {getByText} = render(
      <RenderRootCauseItem
        onClickCheckBox={mockOnClickCheckBox}
        title={mockTitle}
        data={[]}
      />,
    );

    expect(
      getByText(
        StringUtils.uppercaseFirstCharRestLowercase(`No ${mockTitle} found`),
      ),
    ).toBeTruthy();
  });
});
