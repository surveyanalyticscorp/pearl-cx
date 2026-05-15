import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AITagsChipList from './AITagsChipList';

jest.mock('../../../routes/commonUI/CommonUI', () => ({
  ChipItem: ({title, onPress, index}) => {
    const {Pressable, Text} = require('react-native');
    return (
      <Pressable
        testID={`chip-${index}`}
        onPress={() => onPress && onPress({name: title, isChecked: true}, index)}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

const tags = (count) =>
  Array.from({length: count}, (_, i) => ({name: `Tag${i + 1}`, isChecked: true}));

describe('AITagsChipList', () => {
  it('renders nothing when checkedTags is empty', () => {
    const {queryByTestId} = render(
      <AITagsChipList checkedTags={[]} onItemSelect={jest.fn()} />,
    );
    expect(queryByTestId('chip-0')).toBeNull();
  });

  it('renders up to 4 chips', () => {
    const {getByText, queryByText} = render(
      <AITagsChipList checkedTags={tags(3)} onItemSelect={jest.fn()} />,
    );
    expect(getByText('Tag1')).toBeTruthy();
    expect(getByText('Tag3')).toBeTruthy();
    expect(queryByText('1+')).toBeNull();
  });

  it('renders count chip when more than 4 tags', () => {
    const {getByText} = render(
      <AITagsChipList
        checkedTags={tags(6)}
        onItemSelect={jest.fn()}
        onCountChipPress={jest.fn()}
      />,
    );
    expect(getByText('Tag1')).toBeTruthy();
    expect(getByText('Tag4')).toBeTruthy();
    expect(getByText('2+')).toBeTruthy();
  });

  it('calls onItemSelect when chip pressed', () => {
    const onItemSelect = jest.fn();
    const {getByTestId} = render(
      <AITagsChipList checkedTags={tags(2)} onItemSelect={onItemSelect} />,
    );
    fireEvent.press(getByTestId('chip-0'));
    expect(onItemSelect).toHaveBeenCalled();
  });

  it('calls onCountChipPress when count chip pressed', () => {
    const onCountChipPress = jest.fn();
    const {getByTestId} = render(
      <AITagsChipList
        checkedTags={tags(5)}
        onItemSelect={jest.fn()}
        onCountChipPress={onCountChipPress}
      />,
    );
    fireEvent.press(getByTestId('chip--1'));
    expect(onCountChipPress).toHaveBeenCalled();
  });

  it('renders with testID on container', () => {
    const {getByTestId} = render(
      <AITagsChipList
        checkedTags={tags(1)}
        onItemSelect={jest.fn()}
        testID="chip-list"
      />,
    );
    expect(getByTestId('chip-list')).toBeTruthy();
  });
});
