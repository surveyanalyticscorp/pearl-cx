import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectEmailTemplate from './SelectEmailTemplate';

jest.mock('../../../routes/commonUI/ListItemSeparator', () => () => null);

describe('SelectEmailTemplate', () => {
  const templates = [
    {id: 1, title: 'Welcome Email'},
    {id: 2, title: 'Follow Up'},
  ];

  it('renders template titles from data', () => {
    const {getByText} = render(
      <SelectEmailTemplate data={templates} handleOnPress={jest.fn()} />,
    );
    expect(getByText('Welcome Email')).toBeTruthy();
    expect(getByText('Follow Up')).toBeTruthy();
  });

  it('calls handleOnPress with the item when a template is pressed', () => {
    const handleOnPress = jest.fn();
    const {getByText} = render(
      <SelectEmailTemplate data={templates} handleOnPress={handleOnPress} />,
    );
    fireEvent.press(getByText('Welcome Email'));
    expect(handleOnPress).toHaveBeenCalledWith(templates[0]);
  });

  it('renders empty FlatList when data is empty', () => {
    const {toJSON} = render(
      <SelectEmailTemplate data={[]} handleOnPress={jest.fn()} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
