import React from 'react';
import {render} from '@testing-library/react-native';
import TextLabel from './TextLabel';

describe('TextLabel', () => {
  it('renders text prop content', () => {
    const {getByText} = render(<TextLabel text="Hello World" />);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders children when no text prop given', () => {
    const {getByText} = render(<TextLabel>Child text</TextLabel>);
    expect(getByText('Child text')).toBeTruthy();
  });

  it('prefers text prop over children', () => {
    const {getByText, queryByText} = render(
      <TextLabel text="text-prop">children-text</TextLabel>,
    );
    expect(getByText('text-prop')).toBeTruthy();
    expect(queryByText('children-text')).toBeNull();
  });

  it('uses default testID of text-label', () => {
    const {getByTestId} = render(<TextLabel text="Hi" />);
    expect(getByTestId('text-label')).toBeTruthy();
  });

  it('uses custom testID when provided', () => {
    const {getByTestId} = render(<TextLabel text="Hi" testID="custom-label" />);
    expect(getByTestId('custom-label')).toBeTruthy();
  });

  it('applies custom color prop', () => {
    const {getByTestId} = render(
      <TextLabel text="colored" color="#ff0000" />,
    );
    const style = getByTestId('text-label').props.style;
    expect(style.color).toBe('#ff0000');
  });

  it('passes numberOfLines prop through to Text', () => {
    const {getByTestId} = render(
      <TextLabel text="long text" numberOfLines={2} />,
    );
    expect(getByTestId('text-label').props.numberOfLines).toBe(2);
  });

  it('renders without crashing with no props', () => {
    const {toJSON} = render(<TextLabel />);
    expect(toJSON()).toBeTruthy();
  });
});
