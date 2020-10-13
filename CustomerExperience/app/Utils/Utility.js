import React, {useEffect, useRef} from 'react';

export const isStringNullOrEmpty = string => {
  if (string) {
    return string.trim() === '' || string.trim().length === 0;
  }
  return true;
};

export const validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const isObjectEmpty = object => {
  return object && Object.keys(object).length === 0
};

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
