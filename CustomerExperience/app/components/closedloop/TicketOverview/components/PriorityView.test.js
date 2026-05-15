import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import PriorityView from './PriorityView';

jest.mock('../../../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));
jest.mock('../../../../Utils/TicketUtils', () => ({getPriorityById: jest.fn(id => `Priority${id}`)}));
jest.mock('../../../../routes/commonUI/CommonUI', () => ({
  RenderPriorityIcon: () => {
    const {View} = require('react-native');
    return <View testID="priority-icon" />;
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
const wrap = (priority) =>
  <Provider store={mockStore({dashboard: {ticket: {priority}}})}><PriorityView onPress={jest.fn()} /></Provider>;

describe('PriorityView', () => {
  it('renders priority name from store', () => {
    const {getByTestId} = render(wrap(2));
    expect(getByTestId('current-item').props.children).toBe('Priority2');
  });

  it('shows select priority label when priority is undefined', () => {
    const {getByTestId} = render(wrap(undefined));
    expect(getByTestId('current-item').props.children).toBe('ticket_overview.select_priority');
  });

  it('calls onPress when dropdown is pressed', () => {
    const mockPress = jest.fn();
    const store = mockStore({dashboard: {ticket: {priority: 1}}});
    const {getByTestId} = render(
      <Provider store={store}><PriorityView onPress={mockPress} /></Provider>,
    );
    fireEvent.press(getByTestId('dropdown-button'));
    expect(mockPress).toHaveBeenCalled();
  });
});
