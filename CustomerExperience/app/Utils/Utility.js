import React, {useEffect, useRef} from 'react';
import {showMessage} from 'react-native-flash-message';
import {Colors} from '../styles/color.constants';
import {EMAIL_PATTERN} from '../api/Constant';

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
  return showMessage({
    message: error ?? 'something went worng, please try again later.',
    type: 'danger',
    backgroundColor: Colors.red,
    color: Colors.white,
  });
};

export const showSuccessFlashMessage = message => {
  return showMessage({
    message: message,
    type: 'success',
    backgroundColor: Colors.success,
    color: Colors.white,
  });
};

export const showSuccesfullyCopiedFlashMessage = (
  message,
  textColor,
  backgroundColor,
) => {
  return showMessage({
    message: message,
    type: 'success',
    backgroundColor: backgroundColor,
    color: textColor,
  });
};
