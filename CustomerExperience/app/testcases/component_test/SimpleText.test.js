import React from 'react';
import {Text} from 'react-native';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import SimpleText from '../../widgets/dashboardWidget/SimpleTest'; // adjust the import path as necessary
import {render, screen} from '@testing-library/react-native';

describe('SimpleText Component', () => {
  it('should render the text passed as children', () => {
    const testText = 'Hello';
    const wrapper = renderer
      .create(<SimpleText>{testText}</SimpleText>)
      .toJSON();
    // expect(wrapper).toMatchSnapshot();
    expect(wrapper.children[0]).toBe(testText);
    //   const wrapper = shallow(<SimpleText>Test Text</SimpleText>);
    //   expect(wrapper.find(Text).children().text()).toBe('Test Text');
  });
});
