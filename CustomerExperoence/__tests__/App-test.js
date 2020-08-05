/**
 * @format
 */

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
});
