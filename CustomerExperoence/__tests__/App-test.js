/**
 * @format
 */
/* eslint-disable */
import 'react-native';
import React from 'react';
import {mount, shallow} from 'enzyme';
import CompanyCode from '../app/components/login/CompanyCode';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

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
