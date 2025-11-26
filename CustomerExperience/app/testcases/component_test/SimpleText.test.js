import React from 'react';
import renderer from 'react-test-renderer';
import SimpleText from '../../widgets/dashboardWidget/SimpleTest'; // adjust the import path as necessary

describe('SimpleText Component', () => {
  it('should render the text passed as children', () => {
    const testText = 'Hello';
    const wrapper = renderer
      .create(<SimpleText>{testText}</SimpleText>)
      .toJSON();
    expect(wrapper.children[0]).toBe(testText);
  });
});
