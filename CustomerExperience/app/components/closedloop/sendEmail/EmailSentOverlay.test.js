import React from 'react';
import {render} from '@testing-library/react-native';
import EmailSentOverlay from './EmailSentOverlay';

jest.mock('../../../assets/images/check.svg', () => 'CheckSvg');
jest.mock('../../../Utils/IconUtils', () => ({
  MaterialIcons: ({name}) => {
    const {Text} = require('react-native');
    return <Text testID={`icon-${name}`}>{name}</Text>;
  },
}));

describe('EmailSentOverlay', () => {
  it('shows success message and check icon when isSuccess is true', () => {
    const {getByText} = render(<EmailSentOverlay isSuccess={true} />);
    expect(getByText('Email sent successfully')).toBeTruthy();
  });

  it('shows error message and close icon when isSuccess is false', () => {
    const {getByText, getByTestId} = render(<EmailSentOverlay isSuccess={false} />);
    expect(getByText('Email sending failed')).toBeTruthy();
    expect(getByTestId('icon-close')).toBeTruthy();
  });
});
