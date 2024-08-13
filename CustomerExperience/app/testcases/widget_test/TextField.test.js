import React from 'react';
import QPTextField from '../../widgets/TextField';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<QPTextField />).toJSON();
  expect(tree).toMatchSnapshot();
});
