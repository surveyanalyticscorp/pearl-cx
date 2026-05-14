import React from 'react';
import {render} from '@testing-library/react-native';
import {VerticalSpaceBox, HorizontalSpaceBox} from './SpaceBox';

describe('VerticalSpaceBox', () => {
  it('renders without crashing', () => {
    const {UNSAFE_getByType} = render(<VerticalSpaceBox />);
    const {View} = require('react-native');
    expect(UNSAFE_getByType(View)).toBeTruthy();
  });

  it('applies default marginVertical when no props given', () => {
    const {UNSAFE_getByType} = render(<VerticalSpaceBox />);
    const {View} = require('react-native');
    const view = UNSAFE_getByType(View);
    expect(view.props.style.marginVertical).toBeGreaterThan(0);
  });

  it('applies custom marginVertical multiplied by multiplyBy', () => {
    const {UNSAFE_getByType} = render(
      <VerticalSpaceBox marginVertical={10} multiplyBy={2} />,
    );
    const {View} = require('react-native');
    const view = UNSAFE_getByType(View);
    expect(view.props.style.marginVertical).toBe(20);
  });

  it('applies default marginVertical scaled by multiplyBy', () => {
    const {UNSAFE_getByType} = render(<VerticalSpaceBox multiplyBy={3} />);
    const {View} = require('react-native');
    const view = UNSAFE_getByType(View);
    expect(view.props.style.marginVertical).toBeGreaterThan(0);
  });
});

describe('HorizontalSpaceBox', () => {
  it('renders without crashing', () => {
    const {UNSAFE_getByType} = render(<HorizontalSpaceBox />);
    const {View} = require('react-native');
    expect(UNSAFE_getByType(View)).toBeTruthy();
  });

  it('applies custom marginHorizontal multiplied by multiplyBy', () => {
    const {UNSAFE_getByType} = render(
      <HorizontalSpaceBox marginHorizontal={8} multiplyBy={2} />,
    );
    const {View} = require('react-native');
    const view = UNSAFE_getByType(View);
    expect(view.props.style.marginHorizontal).toBe(16);
  });

  it('applies default marginHorizontal scaled by multiplyBy', () => {
    const {UNSAFE_getByType} = render(<HorizontalSpaceBox multiplyBy={2} />);
    const {View} = require('react-native');
    const view = UNSAFE_getByType(View);
    expect(view.props.style.marginHorizontal).toBeGreaterThan(0);
  });
});
