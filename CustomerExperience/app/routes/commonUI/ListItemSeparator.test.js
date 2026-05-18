import React from 'react';
import {render} from '@testing-library/react-native';
import ListItemSeparator from './ListItemSeparator';

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    darkGrey: '#333333',
  },
}));

describe('ListItemSeparator', () => {
  it('should render a View component', () => {
    const {UNSAFE_getByType} = render(<ListItemSeparator />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should use default height of 0.5', () => {
    const {UNSAFE_getByType} = render(<ListItemSeparator />);
    const view = UNSAFE_getByType('View');
    expect(view.props.style.height).toBe(0.5);
  });

  it('should use default backgroundColor of darkGrey', () => {
    const {UNSAFE_getByType} = render(<ListItemSeparator />);
    const view = UNSAFE_getByType('View');
    expect(view.props.style.backgroundColor).toBe('#333333');
  });

  it('should accept custom height prop', () => {
    const {UNSAFE_getByType} = render(<ListItemSeparator height={1} />);
    const view = UNSAFE_getByType('View');
    expect(view.props.style.height).toBe(1);
  });

  it('should accept custom backgroundColor prop', () => {
    const {UNSAFE_getByType} = render(
      <ListItemSeparator backgroundColor="#ff0000" />,
    );
    const view = UNSAFE_getByType('View');
    expect(view.props.style.backgroundColor).toBe('#ff0000');
  });

  it('should accept custom style prop', () => {
    const customStyle = {marginVertical: 10};
    const {UNSAFE_getByType} = render(
      <ListItemSeparator style={customStyle} />,
    );
    const view = UNSAFE_getByType('View');
    expect(view.props.style.marginVertical).toBe(10);
  });

  it('should merge custom style with default properties', () => {
    const customStyle = {marginVertical: 10};
    const {UNSAFE_getByType} = render(
      <ListItemSeparator height={1} backgroundColor="#0000ff" style={customStyle} />,
    );
    const view = UNSAFE_getByType('View');
    expect(view.props.style.height).toBe(1);
    expect(view.props.style.backgroundColor).toBe('#0000ff');
    expect(view.props.style.marginVertical).toBe(10);
  });

  it('should handle height of 0', () => {
    const {UNSAFE_getByType} = render(<ListItemSeparator height={0} />);
    const view = UNSAFE_getByType('View');
    expect(view.props.style.height).toBe(0);
  });

  it('should handle large height values', () => {
    const {UNSAFE_getByType} = render(<ListItemSeparator height={100} />);
    const view = UNSAFE_getByType('View');
    expect(view.props.style.height).toBe(100);
  });

  it('should handle different color values', () => {
    const colors = ['#ffffff', '#000000', 'red', 'rgba(255,0,0,0.5)'];
    colors.forEach((color) => {
      const {UNSAFE_getByType} = render(
        <ListItemSeparator backgroundColor={color} />,
      );
      const view = UNSAFE_getByType('View');
      expect(view.props.style.backgroundColor).toBe(color);
    });
  });

  it('should render with all props specified', () => {
    const customStyle = {paddingHorizontal: 5};
    const {UNSAFE_getByType} = render(
      <ListItemSeparator
        height={2}
        backgroundColor="#cccccc"
        style={customStyle}
      />,
    );
    const view = UNSAFE_getByType('View');
    expect(view.props.style.height).toBe(2);
    expect(view.props.style.backgroundColor).toBe('#cccccc');
    expect(view.props.style.paddingHorizontal).toBe(5);
  });

  it('should accept null style prop', () => {
    const {UNSAFE_getByType} = render(
      <ListItemSeparator style={null} />,
    );
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should accept undefined style prop', () => {
    const {UNSAFE_getByType} = render(
      <ListItemSeparator style={undefined} />,
    );
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should handle custom style overriding height', () => {
    const customStyle = {height: 5};
    const {UNSAFE_getByType} = render(
      <ListItemSeparator height={1} style={customStyle} />,
    );
    const view = UNSAFE_getByType('View');
    // Custom style spreads after defaults, so it should take precedence
    expect(view.props.style.height).toBe(5);
  });

  it('should handle custom style overriding backgroundColor', () => {
    const customStyle = {backgroundColor: '#123456'};
    const {UNSAFE_getByType} = render(
      <ListItemSeparator backgroundColor="#ff0000" style={customStyle} />,
    );
    const view = UNSAFE_getByType('View');
    // Custom style spreads after defaults, so it should take precedence
    expect(view.props.style.backgroundColor).toBe('#123456');
  });
});
