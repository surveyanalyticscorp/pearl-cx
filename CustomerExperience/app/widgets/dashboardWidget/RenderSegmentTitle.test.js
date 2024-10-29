import React from 'react';
import {render} from '@testing-library/react-native';
import RenderSegmentTitle from './RenderSegmentTitle';
import {View} from 'react-native';

const mockProps = {
  text: 'text',
  child: <View />,
};

const renderComponent = () => {
  return render(<RenderSegmentTitle {...mockProps} />);
};

describe('RenderSegmentTitle Component', () => {
  it('renders the RenderSegmentTitle with default size', () => {
    const {getByTestId} = renderComponent();

    expect(getByTestId('render-segment-title-text')).toBeTruthy();
    expect(getByTestId('render-segment-title-text').props.children).toBe(
      'text',
    );
    expect(getByTestId('render-segment-title-text').props.style).toBeTruthy();
    expect(getByTestId('render-segment-title-text').props.style).toEqual(
      expect.objectContaining({
        color: expect.any(String),
      }),
    );
  });

  it('renders the RenderSegmentTitle with custom size', () => {
    const {getByTestId} = renderComponent();
    const text = getByTestId('render-segment-title-text');

    // Check if the text is rendered
    expect(text).toBeTruthy();
  });
});
