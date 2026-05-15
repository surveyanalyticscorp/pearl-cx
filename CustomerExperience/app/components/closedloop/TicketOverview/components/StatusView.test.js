import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import StatusView from './StatusView';

jest.mock('../../../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));
jest.mock('../../../../Utils/TicketUtils', () => ({getStatusById: jest.fn(id => `Status${id}`)}));
jest.mock('../../../../routes/commonUI/CommonUI', () => ({
  RenderStatusIcon: () => {
    const {View} = require('react-native');
    return <View testID="status-icon" />;
  },
}));
jest.mock('../../ui/ShowTitleAndDropdown', () => {
  const {Pressable, Text} = require('react-native');
  return ({title, currentItemName, onPress}) => (
    <Pressable testID="dropdown-button" onPress={onPress}>
      <Text testID="title-text">{title}</Text>
      <Text testID="current-item">{currentItemName}</Text>
    </Pressable>
  );
});

const mockStore = configureStore([]);
const wrap = (status) =>
  <Provider store={mockStore({dashboard: {ticket: {status}}})}><StatusView onPress={jest.fn()} /></Provider>;

describe('StatusView', () => {
  it('renders status name from store', () => {
    const {getByTestId} = render(wrap(1));
    expect(getByTestId('current-item').props.children).toBe('Status1');
  });

  it('shows translate key when status is undefined', () => {
    const {getByTestId} = render(wrap(undefined));
    expect(getByTestId('current-item').props.children).toBe('close_loop.status');
  });

  it('calls onPress when dropdown is pressed', () => {
    const mockPress = jest.fn();
    const store = mockStore({dashboard: {ticket: {status: 1}}});
    const {getByTestId} = render(
      <Provider store={store}><StatusView onPress={mockPress} /></Provider>,
    );
    fireEvent.press(getByTestId('dropdown-button'));
    expect(mockPress).toHaveBeenCalled();
  });
});
