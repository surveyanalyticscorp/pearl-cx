import React from 'react';
import {render} from '@testing-library/react-native';
import NPSIcon from './NPSIcon';

describe('NPSIcon Component', () => {
  it('renders correctly without crashing', () => {
    const {getByTestId} = render(<NPSIcon sentiment="Promoter" />);
    expect(getByTestId('nps-icon')).toBeTruthy();
  });

  it('displays the correct icon for Detractor sentiment', () => {
    const {getByTestId} = render(<NPSIcon sentiment="Detractor" />);
    const image = getByTestId('nps-icon');
    expect(image.props.source).toEqual(
      require('./../../assets/images/detractor.png'),
    );
  });

  it('displays the correct icon for Passive sentiment', () => {
    const {getByTestId} = render(<NPSIcon sentiment="Passive" />);
    const image = getByTestId('nps-icon');
    expect(image.props.source).toEqual(
      require('./../../assets/images/passive.png'),
    );
  });

  it('displays the correct icon for default sentiment (Promoter)', () => {
    const {getByTestId} = render(<NPSIcon sentiment="Promoter" />);
    const image = getByTestId('nps-icon');
    expect(image.props.source).toEqual(
      require('./../../assets/images/promoter.png'),
    );
  });

  it('applies the correct size from the size prop', () => {
    const testSize = 24;
    const {getByTestId} = render(
      <NPSIcon sentiment="Promoter" size={testSize} />,
    );
    const image = getByTestId('nps-icon');
    expect(image.props.style.width).toBe(testSize);
    expect(image.props.style.height).toBe(testSize);
  });

  it('uses default size when size prop is not provided', () => {
    const defaultSize = 16;
    const {getByTestId} = render(<NPSIcon sentiment="Promoter" />);
    const image = getByTestId('nps-icon');
    expect(image.props.style.width).toBe(defaultSize);
    expect(image.props.style.height).toBe(defaultSize);
  });
});
