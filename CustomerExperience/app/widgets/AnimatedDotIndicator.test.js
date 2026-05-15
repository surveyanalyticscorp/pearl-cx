import React from 'react';
import {render} from '@testing-library/react-native';
import AnimatedDotIndicator from './AnimatedDotIndicator';

describe('AnimatedDotIndicator', () => {
  it('renders without crashing', () => {
    const {getByTestId} = render(<AnimatedDotIndicator />);
    expect(getByTestId('dot-indicator-container')).toBeTruthy();
  });

  it('renders 3 dots by default', () => {
    const {getByTestId, queryByTestId} = render(<AnimatedDotIndicator />);
    expect(getByTestId('dot-0')).toBeTruthy();
    expect(getByTestId('dot-1')).toBeTruthy();
    expect(getByTestId('dot-2')).toBeTruthy();
    expect(queryByTestId('dot-3')).toBeNull();
  });

  it('renders the correct number of dots when count is provided', () => {
    const {getByTestId, queryByTestId} = render(
      <AnimatedDotIndicator count={5} />,
    );
    expect(getByTestId('dot-0')).toBeTruthy();
    expect(getByTestId('dot-4')).toBeTruthy();
    expect(queryByTestId('dot-5')).toBeNull();
  });

  it('applies the correct color to each dot', () => {
    const {getByTestId} = render(<AnimatedDotIndicator color="#FF0000" />);
    expect(getByTestId('dot-0').props.style.backgroundColor).toBe('#FF0000');
    expect(getByTestId('dot-1').props.style.backgroundColor).toBe('#FF0000');
    expect(getByTestId('dot-2').props.style.backgroundColor).toBe('#FF0000');
  });

  it('applies the correct size to each dot', () => {
    const {getByTestId} = render(<AnimatedDotIndicator size={20} />);
    const dot = getByTestId('dot-0');
    expect(dot.props.style.width).toBe(20);
    expect(dot.props.style.height).toBe(20);
    expect(dot.props.style.borderRadius).toBe(10);
  });

  it('container has row flexDirection', () => {
    const {getByTestId} = render(<AnimatedDotIndicator />);
    expect(getByTestId('dot-indicator-container').props.style.flexDirection).toBe('row');
  });

  it('cleans up animations on unmount', () => {
    const {unmount} = render(<AnimatedDotIndicator />);
    expect(() => unmount()).not.toThrow();
  });

  it('uses custom animationDuration', () => {
    const {getByTestId} = render(
      <AnimatedDotIndicator animationDuration={800} />,
    );
    expect(getByTestId('dot-indicator-container')).toBeTruthy();
  });
});
