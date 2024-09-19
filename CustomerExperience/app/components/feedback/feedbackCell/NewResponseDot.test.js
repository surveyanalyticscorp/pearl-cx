import React from 'react';
import {render} from '@testing-library/react-native';
import NewResponseDot from './NewResponseDot';
import {Colors} from '../../../styles/color.constants';

describe('NewResponseDot Component', () => {
  it('renders correctly without crashing', () => {
    const {getByTestId} = render(<NewResponseDot />);
    expect(getByTestId('new-response-dot-container')).toBeTruthy();
  });

  it('applies the accent color when isNewResponse is true', () => {
    const {getByTestId} = render(<NewResponseDot isNewResponse={true} />);
    const indicator = getByTestId('new-response-dot-indicator');
    expect(indicator.props.style.backgroundColor).toBe(Colors.accentLight);
  });

  it('applies transparent color when isNewResponse is false', () => {
    const {getByTestId} = render(<NewResponseDot isNewResponse={false} />);
    const indicator = getByTestId('new-response-dot-indicator');
    expect(indicator.props.style.backgroundColor).toBe(Colors.transparent);
  });
});
