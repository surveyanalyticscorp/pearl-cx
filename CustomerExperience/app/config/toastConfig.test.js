import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import toastConfig from './toastConfig';

describe('Toast Config', () => {
  describe('CustomErrorToast', () => {
    const errorProps = {
      text1: 'Error message',
      props: {
        bodyText: 'An error occurred',
        leadingIcon: {
          testID: 'error-toast-icon',
          name: 'alert-circle-outline',
          color: '#ff0000',
        },
        trailingIcon: {
          testID: 'close-error-toast-button',
          onPress: jest.fn(),
          color: '#ff0000',
        },
      },
    };

    it('renders CustomErrorToast with correct message and icons', () => {
      const {getByTestId, getByText} = render(
        toastConfig.custom_error(errorProps),
      );

      expect(getByTestId('error-toast-container')).toBeTruthy();
      expect(getByTestId('error-toast-icon')).toBeTruthy();
      expect(getByText('Error message')).toBeTruthy();
      expect(getByTestId('close-error-toast-button')).toBeTruthy();
    });

    it('calls onPress function when trailing icon is pressed in CustomErrorToast', () => {
      const {getByTestId} = render(toastConfig.custom_error(errorProps));
      fireEvent.press(getByTestId('close-error-toast-button'));
      expect(errorProps.props.trailingIcon.onPress).toHaveBeenCalled();
    });
  });

  describe('CustomSuccessToast', () => {
    const successProps = {
      text1: 'Success message',
      props: {
        bodyText: 'Action was successful',
        leadingIcon: {
          testID: 'success-toast-icon',
          name: 'checkmark-circle-outline',
          color: '#00ff00',
        },
        trailingIcon: {
          testID: 'close-success-toast-button',
          onPress: jest.fn(),
          color: '#00ff00',
        },
      },
    };

    it('renders CustomSuccessToast with correct message and icons', () => {
      const {getByTestId, getByText} = render(
        toastConfig.custom_success(successProps),
      );

      expect(getByTestId('success-toast-container')).toBeTruthy();
      expect(getByTestId('success-toast-icon')).toBeTruthy();
      expect(getByText('Success message')).toBeTruthy();
      expect(getByTestId('close-success-toast-button')).toBeTruthy();
    });

    it('calls onPress function when trailing icon is pressed in CustomSuccessToast', () => {
      const {getByTestId} = render(toastConfig.custom_success(successProps));
      fireEvent.press(getByTestId('close-success-toast-button'));
      expect(successProps.props.trailingIcon.onPress).toHaveBeenCalled();
    });
  });

  describe('CustomInfoToast', () => {
    const infoProps = {
      text1: 'Info message',
      props: {
        bodyText: 'An important information',
        leadingIcon: {
          testID: 'info-toast-icon',
          name: 'info-circle-outline',
          color: '#00ff00',
        },
        trailingIcon: {
          testID: 'close-info-toast-button',
          onPress: jest.fn(),
          color: '#00ff00',
        },
      },
    };

    it('renders CustomInfoToast with correct message and icons', () => {
      const {getByTestId, getByText} = render(
        toastConfig.custom_info(infoProps),
      );

      expect(getByTestId('info-toast-container')).toBeTruthy();
      expect(getByTestId('info-toast-icon')).toBeTruthy();
      expect(getByText('Info message')).toBeTruthy();
      expect(getByTestId('close-info-toast-button')).toBeTruthy();
    });

    it('calls onPress function when trailing icon is pressed in CustomInfoToast', () => {
      const {getByTestId} = render(toastConfig.custom_info(infoProps));
      fireEvent.press(getByTestId('close-info-toast-button'));
      expect(infoProps.props.trailingIcon.onPress).toHaveBeenCalled();
    });
  });
});
