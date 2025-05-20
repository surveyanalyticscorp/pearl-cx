import React from 'react';
import {render} from '@testing-library/react-native';
import AnimatedView from './AnimatedView';

const mockProps = {
  fall: 0.5,
};

const renderComponent = () => {
  return render(<AnimatedView {...mockProps} />);
};

describe('AnimatedView Component', () => {
  it('renders the AnimatedView with default fall', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('animated-view')).toBeTruthy();
  });
});
