import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CalendarScreen from './calendarScreen';
import {Modal} from 'react-native';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-safe-area-view', () => 'SafeAreaView');

describe('CalendarScreen', () => {
  const mockCloseCalendar = jest.fn();

  const renderComponent = (showCalendar = true) =>
    render(
      <CalendarScreen
        showCalendar={showCalendar}
        closeCalendar={mockCloseCalendar}
        selectedDate={{month: 5, year: 2023}}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders CalendarScreen component correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('calendar-modal')).toBeTruthy();
  });

  it('displays the modal when showCalendar is true', () => {
    const {getByTestId} = renderComponent(true);
    const modal = getByTestId('calendar-modal');
    expect(modal.props.visible).toBe(true);
  });

  it('does not display the modal when showCalendar is false', () => {
    const {getByTestId} = renderComponent(false);
    const modal = getByTestId('calendar-modal');
    expect(modal.props.visible).toBe(false);
  });

  it('calls closeCalendar with false when close button is pressed', () => {
    const {getByTestId} = renderComponent();

    // Press the close button
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);

    expect(mockCloseCalendar).toHaveBeenCalledWith(false);
  });
  it('does not throw an error if closeCalendar prop is not provided', () => {
    const {getByTestId} = renderComponent(true, undefined);

    // Press the close button without closeCalendar prop
    const closeButton = getByTestId('close-button');
    expect(() => fireEvent.press(closeButton)).not.toThrow();
  });

  it('calls closeCalendar with false on modal onRequestClose event', () => {
    const {getByTestId} = renderComponent();

    // Trigger the onRequestClose event
    const modal = getByTestId('calendar-modal');
    fireEvent(modal, 'onRequestClose');

    expect(mockCloseCalendar).toHaveBeenCalledWith(false);
  });
});
