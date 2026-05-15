import React from 'react';
import {render} from '@testing-library/react-native';
import {EmailBodyTextView} from './AiEmailBodyTextView';

jest.mock('react-native-render-html', () => ({
  __esModule: true,
  default: () => null,
  defaultSystemFonts: [],
}));

describe('EmailBodyTextView', () => {
  it('renders without crashing', () => {
    const {getByTestId} = render(<EmailBodyTextView text="<p>Hello</p>" />);
    expect(getByTestId('email-body-text-container')).toBeTruthy();
  });

  it('renders with empty text', () => {
    const {getByTestId} = render(<EmailBodyTextView text="" />);
    expect(getByTestId('email-body-text-container')).toBeTruthy();
  });

  it('renders with HTML content', () => {
    const {getByTestId} = render(
      <EmailBodyTextView text="<b>Bold</b> <i>Italic</i>" />,
    );
    expect(getByTestId('email-body-text-container')).toBeTruthy();
  });
});
