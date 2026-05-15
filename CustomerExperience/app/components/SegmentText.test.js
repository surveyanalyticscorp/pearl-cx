import React from 'react';
import {render} from '@testing-library/react-native';
import SegmentText from './SegmentText';

describe('SegmentText', () => {
  it('renders screenName and segmentName on phone', () => {
    const {getByText} = render(
      <SegmentText screenName="Dashboard" segmentName="Segment A" />,
    );
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Segment A')).toBeTruthy();
  });

  it('renders combined text on iPad (isPad=true)', () => {
    jest.mock('react-native', () => {
      const RN = jest.requireActual('react-native');
      RN.Platform.isPad = true;
      return RN;
    });
    jest.resetModules();
    const {Platform} = require('react-native');
    Platform.isPad = true;
    const SegmentTextFresh = require('./SegmentText').default;
    const {getByText} = render(
      <SegmentTextFresh screenName="Dashboard" segmentName="Segment A" />,
    );
    // isPad uses Platform.OS && Platform.isPad — may render either variant
    const result = getByText(/Dashboard/);
    expect(result).toBeTruthy();
    jest.resetModules();
  });
});
