import React from 'react';
import {render} from '@testing-library/react-native';
import SegmentText from './SegmentText';

describe('SegmentText', () => {
  it('renders screenName and segmentName', () => {
    const {getByText} = render(
      <SegmentText screenName="Dashboard" segmentName="Segment A" />,
    );
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Segment A')).toBeTruthy();
  });
});
