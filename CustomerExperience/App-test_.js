/**
 * @format
 */
/* eslint-disable */
import 'react-native';
import React from 'react';
import {mount, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SignInScreen from './app/components/login/Login';
jest.mock('@react-native-async-storage/async-storage');
const mockStore = configureMockStore();
const store = mockStore({});

describe('SignInScreen', () => {
  it('should render without throwing an error', () => {
    expect(
      shallow(
        <Provider store={store}>
          <SignInScreen />
        </Provider>,
      ).exists(),
    ).toBe(true);
  });

  describe('#QPTextField', () => {
    it('should render the textfield "emailTextField" in testId emailTextField', () => {
      const app = shallow(
        <Provider store={store}>
          <SignInScreen />
        </Provider>,
      );
      const input = app.find("[testID='emailTextField']");
      expect(input).toHaveLength(0);
    });
    it('should render the textfield passwordTextField" in testId passwordTextField', () => {
      const app = shallow(
        <Provider store={store}>
          <SignInScreen />
        </Provider>,
      );
      const input = app.find("[testID='passwordTextField']");
      expect(input).toHaveLength(0);
    });
    it('should render the textfield companycode TextField" in testId companyCodeTextField', () => {
      const app = shallow(
        <Provider store={store}>
          <SignInScreen />
        </Provider>,
      );
      const input = app.find("[testID='companyCodeTextField']");
      expect(input).toHaveLength(0);
    });
  });
});

/**
 * API TestCasses
 *
 */
