/**
 * @format
 */
/* eslint-disable */
import 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {mount, shallow} from 'enzyme';
import CompanyCode from '../app/components/login/CompanyCode';
import SignInScreen from '../app/components/login/SignIn';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('@react-native-community/async-storage');
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

describe('SignInScreen', () => {
  describe('#QPTextField', () => {
    it('should render the word "C" in testId emailTextField', () => {
      const app = shallow(<SignInScreen />);
      const input = app.find("[testID='emailTextField']");
      expect(input).toHaveLength(1);
    });
    it('should render the word "Password " in testId passwordTextField', () => {
      const app = shallow(<SignInScreen />);
      const input = app.find("[testID='passwordTextField']");
      expect(input).toHaveLength(1);
    });
  });
  describe('#QPButton', () => {
    it('should render the button with testID rectangleAreaButton and text "Next"', () => {
      const app = shallow(<SignInScreen />);
      const button = app.find("[testID='SignInButton']").dive();
      const text = button
          .find('Text')
          .dive()
          .text();
      expect(text).toEqual("Sign In");
    });
  });
});
