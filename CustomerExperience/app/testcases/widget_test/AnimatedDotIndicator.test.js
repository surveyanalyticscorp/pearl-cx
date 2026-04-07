import React from 'react';
import renderer, {act} from 'react-test-renderer';
import AnimatedDotIndicator from '../../widgets/AnimatedDotIndicator';

describe('AnimatedDotIndicator', () => {
  it('renders correctly with default props', () => {
    let tree;
    act(() => {
      tree = renderer.create(<AnimatedDotIndicator />).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });

  it('renders 3 dots by default', () => {
    let tree;
    act(() => {
      tree = renderer.create(<AnimatedDotIndicator />).toJSON();
    });
    expect(tree.children).toHaveLength(3);
  });

  it('renders the correct number of dots when count is provided', () => {
    let tree;
    act(() => {
      tree = renderer.create(<AnimatedDotIndicator count={5} />).toJSON();
    });
    expect(tree.children).toHaveLength(5);
  });

  it('applies the correct color to each dot', () => {
    const color = '#FF0000';
    let tree;
    act(() => {
      tree = renderer.create(<AnimatedDotIndicator color={color} />).toJSON();
    });
    tree.children.forEach(dot => {
      expect(dot.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({backgroundColor: color}),
        ]),
      );
    });
  });

  it('applies the correct size to each dot', () => {
    const size = 20;
    let tree;
    act(() => {
      tree = renderer.create(<AnimatedDotIndicator size={size} />).toJSON();
    });
    tree.children.forEach(dot => {
      expect(dot.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({width: size, height: size, borderRadius: size / 2}),
        ]),
      );
    });
  });

  it('uses row flex direction on the container', () => {
    let tree;
    act(() => {
      tree = renderer.create(<AnimatedDotIndicator />).toJSON();
    });
    expect(tree.props.style).toEqual(
      expect.objectContaining({flexDirection: 'row'}),
    );
  });
});
