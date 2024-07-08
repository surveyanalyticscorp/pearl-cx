import React from 'react';
import {Text} from 'react-native';
import {shallow} from 'enzyme';
import SimpleText from '../../widgets/dashboardWidget/SimpleTest'; // adjust the import path as necessary

describe('SimpleText Component', () => {
  it('should render the text passed as children', () => {
    const wrapper = shallow(<SimpleText>Test Text</SimpleText>);
    expect(wrapper.find(Text).children().text()).toBe('Test Text');
  });
});
