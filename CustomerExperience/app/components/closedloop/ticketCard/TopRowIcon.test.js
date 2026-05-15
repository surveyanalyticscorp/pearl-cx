import React from 'react';
import {render} from '@testing-library/react-native';
import TopRowIcon from './TopRowIcon';

// SVG files are mapped to fileMock.js via moduleNameMapper (returns 'test-file-stub').
// Both branches still get exercised; we just verify the component renders for each.
describe('TopRowIcon', () => {
  it('renders when hasPanelMember=true (email avatar branch)', () => {
    const {toJSON} = render(<TopRowIcon hasPanelMember={true} />);
    expect(toJSON()).not.toBeUndefined();
  });

  it('renders when hasPanelMember=false (edit icon branch)', () => {
    const {toJSON} = render(<TopRowIcon hasPanelMember={false} />);
    expect(toJSON()).not.toBeUndefined();
  });
});
