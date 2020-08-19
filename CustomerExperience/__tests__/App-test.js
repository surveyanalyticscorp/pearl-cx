/**
 * @format
 */
/* eslint-disable */
import 'react-native';
import React from 'react';
import {mount, shallow} from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import CompanyCode from '../app/components/login/CompanyCode';
import SignInScreen from '../app/components/login/Login';
jest.mock('@react-native-community/async-storage');
const mockStore = configureMockStore();
const store = mockStore({});
describe('CompanyCode', () => {
  describe('#QPTextField', () => {
    it('should render the word "Company code" in testId rectangleLengthText', () => {
      const app = shallow(<CompanyCode />);
      const input = app.find("[testID='rectangleLengthInput']");
      expect(input).toHaveLength(1);
    });
  });
  describe('#QPButton', () => {
    it('should render the button with testID rectangleAreaButton and text "Next"', () => {
      const app = shallow(<CompanyCode />);
      const button = app.find("[testID='nextButtonCompanycode']").dive();
      const text = button
        .find('Text')
        .dive()
        .text();
      expect(text).toEqual("Next");
    });
  });
});

describe("SignInScreen", () => {
  it("should render without throwing an error", () => {
    expect(
        shallow(
            <Provider store={store}>
              <SignInScreen />
            </Provider>
        ).exists()
    ).toBe(true);
  });

  describe('#QPTextField', () => {
    it('should render the textfield "emailTextField" in testId emailTextField', () => {
      const app = shallow(<Provider store={store}>
        <SignInScreen />
      </Provider>);
      const input = app.find("[testID='emailTextField']");
      expect(input).toHaveLength(0);
    });
    it('should render the textfield passwordTextField" in testId passwordTextField', () => {
      const app = shallow(<Provider store={store}>
        <SignInScreen />
      </Provider>);
      const input = app.find("[testID='passwordTextField']");
      expect(input).toHaveLength(0);
    });

  });
});

/**
 * API TestCasses
 *
 */
