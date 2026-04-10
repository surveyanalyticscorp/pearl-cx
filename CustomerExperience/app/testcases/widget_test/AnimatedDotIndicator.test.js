import React from 'react';
import renderer from 'react-test-renderer';
import {Animated, View} from 'react-native';
import AnimatedDotIndicator from '../../widgets/AnimatedDotIndicator';

describe('AnimatedDotIndicator', () => {
  it('renders correctly with default props', () => {
    const instance = renderer.create(<AnimatedDotIndicator />);
    expect(instance.toJSON()).toMatchSnapshot();
  });

  it('renders 3 dots by default', () => {
    const instance = renderer.create(<AnimatedDotIndicator />);
    const dots = instance.root.findAllByType(Animated.View);
    expect(dots).toHaveLength(3);
  });

  it('renders the correct number of dots when count is provided', () => {
    const instance = renderer.create(<AnimatedDotIndicator count={5} />);
    const dots = instance.root.findAllByType(Animated.View);
    expect(dots).toHaveLength(5);
  });

  it('applies the correct color to each dot', () => {
    const color = '#FF0000';
    const instance = renderer.create(<AnimatedDotIndicator color={color} />);
    const dots = instance.root.findAllByType(Animated.View);
    dots.forEach(dot => {
      expect(dot.props.style.backgroundColor).toBe(color);
    });
  });

  it('applies the correct size to each dot', () => {
    const size = 20;
    const instance = renderer.create(<AnimatedDotIndicator size={size} />);
    const dots = instance.root.findAllByType(Animated.View);
    dots.forEach(dot => {
      expect(dot.props.style.width).toBe(size);
      expect(dot.props.style.height).toBe(size);
      expect(dot.props.style.borderRadius).toBe(size / 2);
    });
  });

  it('uses row flex direction on the container', () => {
    const instance = renderer.create(<AnimatedDotIndicator />);
    const container = instance.root.findByType(View);
    expect(container.props.style).toEqual(
      expect.objectContaining({flexDirection: 'row'}),
    );
  });
});
