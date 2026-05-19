import React from 'react';
import {render} from '@testing-library/react-native';
import SegmentText from '../../components/SegmentText';
import {Platform} from 'react-native';

describe('SegmentText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DefaultSegmentText (non-iPad)', () => {
    beforeEach(() => {
      Object.defineProperty(Platform, 'isPad', {
        value: false,
        writable: true,
        configurable: true,
      });
    });

    it('renders screen name and segment name on separate lines', () => {
      const {getByText} = render(
        <SegmentText screenName="Dashboard" segmentName="Segment 1" />,
      );

      expect(getByText('Dashboard')).toBeTruthy();
      expect(getByText('Segment 1')).toBeTruthy();
    });

    it('renders different screen names', () => {
      const {getByText} = render(
        <SegmentText screenName="Responses" segmentName="Test" />,
      );

      expect(getByText('Responses')).toBeTruthy();
      expect(getByText('Test')).toBeTruthy();
    });

    it('handles empty segment name', () => {
      const {getByText} = render(
        <SegmentText screenName="Dashboard" segmentName="" />,
      );

      expect(getByText('Dashboard')).toBeTruthy();
    });

    it('handles long segment names', () => {
      const longName = 'A very long segment name';
      const {getByText} = render(
        <SegmentText screenName="Dashboard" segmentName={longName} />,
      );

      expect(getByText(longName)).toBeTruthy();
    });

    it('renders special characters in names', () => {
      const {getByText} = render(
        <SegmentText screenName="Test@#$" segmentName="Seg$%^" />,
      );

      expect(getByText('Test@#$')).toBeTruthy();
      expect(getByText('Seg$%^')).toBeTruthy();
    });
  });

  describe('SegmentTextForIpad (iPad)', () => {
    beforeEach(() => {
      Object.defineProperty(Platform, 'isPad', {
        value: true,
        writable: true,
        configurable: true,
      });
    });

    it('renders combined text with separator', () => {
      const {getByText, queryByText} = render(
        <SegmentText screenName="Dashboard" segmentName="Segment 1" />,
      );

      const combined = queryByText('Dashboard > Segment 1');
      expect(combined).toBeTruthy();
    });

    it('renders different combinations for iPad', () => {
      const {getByText, queryByText} = render(
        <SegmentText screenName="Responses" segmentName="Enterprise" />,
      );

      const combined = queryByText('Responses > Enterprise');
      expect(combined).toBeTruthy();
    });

    it('handles empty segment name on iPad', () => {
      const {getByText, queryByText} = render(
        <SegmentText screenName="Dashboard" segmentName="" />,
      );

      const combined = queryByText('Dashboard > ');
      expect(combined).toBeTruthy();
    });

    it('renders with special characters on iPad', () => {
      const {queryByText} = render(
        <SegmentText screenName="Test@#" segmentName="Seg$%" />,
      );

      const combined = queryByText('Test@# > Seg$%');
      expect(combined).toBeTruthy();
    });
  });

  describe('Platform switching', () => {
    it('renders correctly on non-iPad first, then iPad', () => {
      Object.defineProperty(Platform, 'isPad', {
        value: false,
        writable: true,
        configurable: true,
      });

      const {getByText, rerender, unmount} = render(
        <SegmentText screenName="Dashboard" segmentName="Segment 1" />,
      );

      expect(getByText('Dashboard')).toBeTruthy();
      expect(getByText('Segment 1')).toBeTruthy();

      unmount();

      Object.defineProperty(Platform, 'isPad', {
        value: true,
        writable: true,
        configurable: true,
      });

      const {getByText: getByText2} = render(
        <SegmentText screenName="Dashboard" segmentName="Segment 1" />,
      );

      expect(getByText2(/Dashboard|Segment 1/)).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      Object.defineProperty(Platform, 'isPad', {
        value: false,
        writable: true,
        configurable: true,
      });
    });

    it('renders with numeric values', () => {
      const {getByText} = render(
        <SegmentText screenName="123" segmentName="456" />,
      );

      expect(getByText('123')).toBeTruthy();
      expect(getByText('456')).toBeTruthy();
    });

    it('renders with whitespace', () => {
      const {getByText} = render(
        <SegmentText screenName="  Dashboard  " segmentName="  Segment  " />,
      );

      expect(getByText('  Dashboard  ')).toBeTruthy();
      expect(getByText('  Segment  ')).toBeTruthy();
    });

    it('renders with unicode characters', () => {
      const {getByText} = render(
        <SegmentText screenName="仪表板" segmentName="分段" />,
      );

      expect(getByText('仪表板')).toBeTruthy();
      expect(getByText('分段')).toBeTruthy();
    });
  });
});
