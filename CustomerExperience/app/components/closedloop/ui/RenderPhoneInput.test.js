import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RenderPhoneInput from './RenderPhoneInput';
import {translate} from '../../../Utils/MultilinguaUtils';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

jest.mock('../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('RenderPhoneInput Component', () => {
  const mockSetTicketState = jest.fn();

  beforeEach(() => {
    mockSetTicketState.mockClear();
  });

  it('renders IconAndTitleText component with correct props', () => {
    const {getByText} = render(
      <RenderPhoneInput setTicketState={mockSetTicketState} />,
    );
    expect(getByText('create_new_ticket.phone_number')).toBeTruthy();
  });

  it('renders PhoneInput component correctly', () => {
    const {getByPlaceholderText} = render(
      <RenderPhoneInput setTicketState={mockSetTicketState} />,
    );
    expect(getByPlaceholderText(' ')).toBeTruthy();
  });

  it('updates state on phone number input change', () => {
    const {getByPlaceholderText} = render(
      <RenderPhoneInput setTicketState={mockSetTicketState} />,
    );
    const phoneInput = getByPlaceholderText(' ');

    fireEvent.changeText(phoneInput, '+1234567890');
    expect(phoneInput.props.value).toBe('+1234567890');
  });

  it('calls setTicketState with the correct value when phone number input loses focus', () => {
    const {getByPlaceholderText} = render(
      <RenderPhoneInput setTicketState={mockSetTicketState} />,
    );
    const phoneInput = getByPlaceholderText(' ');

    fireEvent.changeText(phoneInput, '+1234567890');
    fireEvent(phoneInput, 'onEndEditing'); // Trigger onEndEditing instead of blur

    // Verify that setTicketState is called with the updated state
    expect(mockSetTicketState).toHaveBeenCalled();
    expect(mockSetTicketState.mock.calls[0][0]({})).toEqual({
      mobileNumber: '+1234567890',
    });
  });
});
