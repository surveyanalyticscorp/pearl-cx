import React from 'react';
import {render} from '@testing-library/react-native';
import {ResponsesIcon} from './ResponsesIcon';

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    filterIconColor: '#000000',
  },
}));

jest.mock('./../../../assets/images/total_responses_icon.png', () => 'test-file-stub');

describe('ResponsesIcon', () => {
  it('should render Image component', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    expect(getByTestId('image')).toBeTruthy();
  });

  it('should use default size of 12', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(12);
    expect(image.props.style.height).toBe(12);
  });

  it('should use default tintColor from Colors.filterIconColor', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    const image = getByTestId('image');
    expect(image.props.style.tintColor).toBe('#000000');
  });

  it('should accept custom size prop', () => {
    const {getByTestId} = render(<ResponsesIcon size={24} />);
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(24);
    expect(image.props.style.height).toBe(24);
  });

  it('should accept custom tintColor prop', () => {
    const {getByTestId} = render(<ResponsesIcon tintColor="#ff0000" />);
    const image = getByTestId('image');
    expect(image.props.style.tintColor).toBe('#ff0000');
  });

  it('should handle size of 0', () => {
    const {getByTestId} = render(<ResponsesIcon size={0} />);
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(0);
    expect(image.props.style.height).toBe(0);
  });

  it('should handle large size values', () => {
    const {getByTestId} = render(<ResponsesIcon size={100} />);
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(100);
    expect(image.props.style.height).toBe(100);
  });

  it('should handle different color formats', () => {
    const colors = ['#ffffff', '#000000', 'red', 'rgba(255,0,0,0.5)'];
    colors.forEach((color) => {
      const {getByTestId} = render(<ResponsesIcon tintColor={color} />);
      const image = getByTestId('image');
      expect(image.props.style.tintColor).toBe(color);
    });
  });

  it('should render with both custom size and color', () => {
    const {getByTestId} = render(
      <ResponsesIcon size={36} tintColor="#00ff00" />,
    );
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(36);
    expect(image.props.style.height).toBe(36);
    expect(image.props.style.tintColor).toBe('#00ff00');
  });

  it('should load correct image source', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    const image = getByTestId('image');
    expect(image.props.source).toBeDefined();
  });

  it('should maintain square aspect ratio', () => {
    const sizes = [8, 12, 16, 24, 32, 48, 64];
    sizes.forEach((size) => {
      const {getByTestId} = render(<ResponsesIcon size={size} />);
      const image = getByTestId('image');
      expect(image.props.style.width).toBe(image.props.style.height);
    });
  });

  it('should handle decimal size values', () => {
    const {getByTestId} = render(<ResponsesIcon size={12.5} />);
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(12.5);
    expect(image.props.style.height).toBe(12.5);
  });

  it('should render without any props', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    expect(getByTestId('image')).toBeTruthy();
  });

  it('should have square container styles', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    const image = getByTestId('image');
    expect(image.props.style.width).toBe(image.props.style.height);
  });
});
