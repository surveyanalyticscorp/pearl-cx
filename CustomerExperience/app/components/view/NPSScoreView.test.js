import React from 'react';
import {render} from '@testing-library/react-native';
import NPSScoreView from './NPSScoreView';

describe('NPSScoreView', () => {
  const mockText = 'Sample NPS Text';

  it('renders the NPSScoreView component correctly', () => {
    const {getByTestId} = render(<NPSScoreView text={mockText} />);

    // Check that the main NPS view container renders
    expect(getByTestId('nps-view')).toBeTruthy();
  });

  it('displays the correct text passed via props', () => {
    const {getByText} = render(<NPSScoreView text={mockText} />);

    // Verify that the passed text is displayed correctly
    expect(getByText(mockText)).toBeTruthy();
  });

  it('renders the NPS image correctly', () => {
    const {getByTestId} = render(<NPSScoreView text={mockText} />);

    // Check that the NPS image is rendered
    expect(getByTestId('nps-image')).toBeTruthy();
  });
});
