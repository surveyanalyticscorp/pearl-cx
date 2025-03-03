import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RenderDatePickerModal from './RenderDatePickerModal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

// Mock for DatePicker
jest.mock('react-native-date-picker', () => {
  const React = require('react');
  const {View, Pressable} = require('react-native');

  return {
    __esModule: true,
    default: ({onConfirm, onCancel}) => {
      return (
        <View>
          <Pressable
            testID="confirm-button"
            onPress={() => onConfirm(new Date('2022-10-24'))}>
            Confirm
          </Pressable>
          <Pressable testID="cancel-button" onPress={onCancel}>
            Cancel
          </Pressable>
        </View>
      );
    },
  };
});

jest.mock('moment', () =>
  jest.fn(() => ({
    format: jest.fn().mockReturnValue('2024-10-24'),
  })),
);

const DMYFORMAT = 'DD/MM/YYYY';
const YMDFORMAT = 'YYYY-MM-DD';

describe('RenderDatePickerModal', () => {
  const setOpenMock = jest.fn();
  const setDateMock = jest.fn();
  const currentDate = '24/10/2024';

  beforeEach(() => {
    setOpenMock.mockClear();
    setDateMock.mockClear();
  });

  test('renders DatePicker with correct initial values', () => {
    render(
      <RenderDatePickerModal
        isOpen={true}
        setOpen={setOpenMock}
        currentDate={currentDate}
        setDate={setDateMock}
      />,
    );
    // Assertion to verify DatePicker was rendered correctly
  });

  test('calls setDate and setOpen on date confirmation', () => {
    const {getByTestId} = render(
      <RenderDatePickerModal
        isOpen={true}
        setOpen={setOpenMock}
        currentDate={currentDate}
        setDate={setDateMock}
        isStartDate={true}
      />,
    );

    fireEvent.press(getByTestId('confirm-button')); // Simulate confirm press

    expect(setOpenMock).toHaveBeenCalledWith(false);
    expect(setDateMock).toHaveBeenCalledWith(true, new Date('2022-10-24'));
  });

  test('calls setOpen on date cancel', () => {
    const {getByTestId} = render(
      <RenderDatePickerModal
        isOpen={true}
        setOpen={setOpenMock}
        currentDate={currentDate}
        setDate={setDateMock}
      />,
    );

    fireEvent.press(getByTestId('cancel-button')); // Simulate cancel press

    expect(setOpenMock).toHaveBeenCalledWith(false);
  });
});
