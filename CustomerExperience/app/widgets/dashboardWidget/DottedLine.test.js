import React from 'react';
import {render} from '@testing-library/react-native';
import DottedLine from './DottedLine';

describe('DottedLine', () => {
  it('renders without crashing', () => {
    const {getByTestId} = render(<DottedLine />);
    expect(getByTestId('dotted-line')).toBeTruthy();
  });

  it('applies default borderStyle of dotted', () => {
    const {getByTestId} = render(<DottedLine />);
    expect(getByTestId('dotted-line').props.style.borderStyle).toBe('dotted');
  });

  it('applies custom borderStyle prop', () => {
    const {getByTestId} = render(<DottedLine borderStyle="dashed" />);
    expect(getByTestId('dotted-line').props.style.borderStyle).toBe('dashed');
  });

  it('applies custom width prop', () => {
    const {getByTestId} = render(<DottedLine width={20} />);
    expect(getByTestId('dotted-line').props.style.width).toBe(20);
  });

  it('applies custom color prop', () => {
    const {getByTestId} = render(<DottedLine color="#ff0000" />);
    expect(getByTestId('dotted-line').props.style.borderColor).toBe('#ff0000');
  });
});
