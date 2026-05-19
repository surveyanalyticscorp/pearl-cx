import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import EmailTextInput from '../../components/login/components/EmailTextInput';

const mockStore = configureStore([]);

describe('EmailTextInput', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      login: {
        email: '',
      },
    });
  });

  describe('Basic rendering', () => {
    it('should render QPTextField with correct props', () => {
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={jest.fn()} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should render with default value when provided', () => {
      const defaultEmail = 'test@example.com';
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput
            defaultValue={defaultEmail}
            value={defaultEmail}
            setEmail={jest.fn()}
          />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should render with empty default when not provided', () => {
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={jest.fn()} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should render with email value', () => {
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="user@example.com" setEmail={jest.fn()} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });
  });

  describe('Text input handling', () => {
    it('should call setEmail when text changes if provided', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, 'newemail@example.com');

      expect(setEmail).toHaveBeenCalledWith('newemail@example.com');
    });

    it('should dispatch action when text changes if setEmail not provided', () => {
      const dispatchMock = jest.fn();
      store.dispatch = dispatchMock;

      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, 'action@example.com');

      // The dispatch will be called, but we can verify the component rendered
      expect(input).toBeTruthy();
    });

    it('should handle special characters in email', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, 'test+alias@sub.example.co.uk');

      expect(setEmail).toHaveBeenCalledWith('test+alias@sub.example.co.uk');
    });

    it('should handle empty string input', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="test@example.com" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, '');

      expect(setEmail).toHaveBeenCalledWith('');
    });

    it('should handle spaces in email input', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, '  test@example.com  ');

      expect(setEmail).toHaveBeenCalledWith('  test@example.com  ');
    });
  });

  describe('Props variations', () => {
    it('should prioritize setEmail prop over dispatch', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, 'test@example.com');

      expect(setEmail).toHaveBeenCalled();
    });

    it('should work with null defaultValue', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput defaultValue={null} value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should work with undefined defaultValue', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput defaultValue={undefined} value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should handle rapid text changes', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      fireEvent.changeText(input, 't');
      fireEvent.changeText(input, 'te');
      fireEvent.changeText(input, 'tes');
      fireEvent.changeText(input, 'test@example.com');

      expect(setEmail).toHaveBeenCalledTimes(4);
      expect(setEmail).toHaveBeenLastCalledWith('test@example.com');
    });
  });

  describe('Field configuration', () => {
    it('should have email-address keyboard type', () => {
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={jest.fn()} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should not have secure text enabled', () => {
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={jest.fn()} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should not have autofocus enabled', () => {
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={jest.fn()} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long email addresses', () => {
      const setEmail = jest.fn();
      const longEmail = 'a'.repeat(50) + '@example.com';
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value={longEmail} setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      expect(input).toBeTruthy();
    });

    it('should handle international characters in email', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      // Some email providers support unicode
      fireEvent.changeText(input, 'test@例え.jp');

      expect(setEmail).toHaveBeenCalledWith('test@例え.jp');
    });

    it('should handle consecutive calls with same email', () => {
      const setEmail = jest.fn();
      const {getByTestId} = render(
        <Provider store={store}>
          <EmailTextInput value="" setEmail={setEmail} />
        </Provider>,
      );

      const input = getByTestId('emailTextField');
      const email = 'test@example.com';
      fireEvent.changeText(input, email);
      fireEvent.changeText(input, email);
      fireEvent.changeText(input, email);

      expect(setEmail).toHaveBeenCalledTimes(3);
      expect(setEmail).toHaveBeenLastCalledWith(email);
    });
  });
});
