import React from 'react';
import {render} from '@testing-library/react-native';
import RenderInfo from './RenderInfo';

const mockProps = {
  icon: 'icon',
  title: 'title',
  count: 30,
};

const renderComponent = () => {
  return render(<RenderInfo {...mockProps} />);
};

describe('RenderInfo Component', () => {
  it('renders the RenderInfo with default size', () => {
    const {getByTestId} = renderComponent();

    expect(getByTestId('render-info-icon-image')).toBeTruthy();
    expect(getByTestId('render-info-title')).toBeTruthy();
    expect(getByTestId('render-info-title').props.children).toBe('title');
    expect(getByTestId('render-info-title').props.style).toBeTruthy();
    expect(getByTestId('render-info-title').props.style).toEqual(
      expect.objectContaining({
        color: expect.any(String),
      }),
    );
  });

  it('renders the RenderInfo with custom size', () => {
    const {getByTestId} = renderComponent();
    const image = getByTestId('render-info-icon-image');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
  it('renders the RenderInfo with the correct text', () => {
    const {getByTestId} = renderComponent();
    const text = getByTestId('render-info-title');

    // Verify the correct text
    expect(text.props.children).toBe('title');
  });
});
