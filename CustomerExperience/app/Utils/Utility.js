import React, {useEffect, useRef} from 'react';
import {Colors} from '../styles/color.constants';
import {EMAIL_PATTERN} from '../api/Constant';
import Toast from 'react-native-toast-message';
import {IonIcon} from './IconUtils';

export const isStringNullOrEmpty = string => {
  if (string) {
    return string.trim() === '' || string.trim().length === 0;
  }
  return true;
};

export const validateEmail = email => {
  //let re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  //let re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  //return re.test(email);
  let regex = new RegExp(EMAIL_PATTERN);
  return regex.test(email);
};

export const isObjectEmpty = object => {
  return object && Object.keys(object).length === 0;
};

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const showErrorFlashMessage = error => {
  return Toast.show({
    type: 'custom_error',
    props: {
      headerText: 'Error',
      bodyText: error ?? 'something went worng, please try again later.',
      leadingIcon: {
        color: Colors.deleteButtonText,
        testID: 'error-toast-icon',
        name: 'alert-circle-outline',
      },
      trailingIcon: {
        color: Colors.deleteButtonText,
        onPress: () => Toast.hide(),
        testID: 'close-toast-button',
      },
    },
  });
};

export const showSuccessFlashMessage = message => {
  return Toast.show({
    type: 'custom_success',
    props: {
      headerText: 'Success',
      bodyText: message ?? 'Success',
      leadingIcon: {
        color: Colors.toastSuccessTextColor,
        testID: 'success-toast-icon',

        name: 'checkmark-sharp',
      },
      trailingIcon: {
        color: Colors.toastSuccessTextColor,
        onPress: () => Toast.hide(),
        testID: 'close-toast-button',
      },
    },
  });
};

export const getDeviceType = type => (type === 'ios' ? 1 : 0);

export const showInfoFlashMessage = message => {
  return Toast.show({
    type: 'custom_info',
    props: {
      headerText: 'Info',
      bodyText: message ?? 'Info',
      leadingIcon: {
        color: Colors.accent,
        testID: 'info-toast-icon',
        name: 'alert-circle-sharp',
      },
      trailingIcon: {
        color: Colors.accent,
        onPress: () => Toast.hide(),
        testID: 'close-toast-button',
      },
    },
  });
};
