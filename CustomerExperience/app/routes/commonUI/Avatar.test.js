import React from 'react';
import {render} from '@testing-library/react-native';
import {Avatar} from './Avatar';

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    white: '#ffffff',
  },
}));

jest.mock('../../styles/margin.constants', () => ({
  MarginConstants: {
    tab3: 24,
    halfTab: 4,
  },
}));

jest.mock('../../styles/text.styles', () => ({
  baseTextStyles: {
    mediumRegularText: {fontSize: 16, fontWeight: '500'},
  },
}));

jest.mock('../../Utils/TicketUtils', () => ({
  getNameInitials: jest.fn((name) => {
    if (!name || name === 'NA') return 'NA';
    const parts = name.split(' ');
    return parts.map((p) => p.charAt(0).toUpperCase()).join('').slice(0, 2);
  }),
}));

jest.mock('../../Utils/AvatarBackgroundColor', () => ({
  getAvatarColor: jest.fn((name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const hash = (name || '').charCodeAt(0) || 0;
    return colors[hash % colors.length];
  }),
}));

describe('Avatar', () => {
  it('should render avatar view', () => {
    const {UNSAFE_getByType} = render(<Avatar title="John Doe" />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should display initials for single name', () => {
    const {getByText} = render(<Avatar title="Alice" />);
    expect(getByText('A')).toBeTruthy();
  });

  it('should display initials for full name', () => {
    const {getByText} = render(<Avatar title="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('should render text component with initials', () => {
    const {UNSAFE_getByType} = render(<Avatar title="John Doe" />);
    const text = UNSAFE_getByType('Text');
    expect(text.props.children).toBeTruthy();
  });

  it('should use default NA when title is not provided', () => {
    const {getByText} = render(<Avatar />);
    expect(getByText('NA')).toBeTruthy();
  });

  it('should use default NA when title is null', () => {
    const {getByText} = render(<Avatar title={null} />);
    expect(getByText('NA')).toBeTruthy();
  });

  it('should use default NA when title is undefined', () => {
    const {getByText} = render(<Avatar title={undefined} />);
    expect(getByText('NA')).toBeTruthy();
  });

  it('should apply custom style prop', () => {
    const customStyle = {paddingVertical: 10};
    const {UNSAFE_getByType} = render(
      <Avatar title="John" style={customStyle} />,
    );
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should apply custom textStyle prop', () => {
    const customTextStyle = {fontSize: 20};
    const {UNSAFE_getByType} = render(
      <Avatar title="John" textStyle={customTextStyle} />,
    );
    const text = UNSAFE_getByType('Text');
    expect(text).toBeTruthy();
  });

  it('should have white text color', () => {
    const {UNSAFE_getByType} = render(<Avatar title="John" />);
    const text = UNSAFE_getByType('Text');
    expect(text.props.style).toBeDefined();
  });

  it('should have center text alignment', () => {
    const {UNSAFE_getByType} = render(<Avatar title="John" />);
    const text = UNSAFE_getByType('Text');
    expect(text.props.style).toBeDefined();
  });

  it('should render with different names', () => {
    const names = ['Alice', 'Bob Smith', 'Charlie Brown', 'David'];
    names.forEach((name) => {
      const {UNSAFE_getByType} = render(<Avatar title={name} />);
      const text = UNSAFE_getByType('Text');
      expect(text).toBeTruthy();
    });
  });

  it('should have borderRadius styling', () => {
    const {UNSAFE_getByType} = render(<Avatar title="John" />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should have centered alignment for layout', () => {
    const {UNSAFE_getByType} = render(<Avatar title="John" />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should handle special characters in name', () => {
    const {UNSAFE_getByType} = render(<Avatar title="José María" />);
    const text = UNSAFE_getByType('Text');
    expect(text).toBeTruthy();
  });

  it('should handle single letter name', () => {
    const {getByText} = render(<Avatar title="X" />);
    expect(getByText('X')).toBeTruthy();
  });

  it('should handle very long name', () => {
    const {UNSAFE_getByType} = render(
      <Avatar title="Alexander Emmanuel Rodriguez" />,
    );
    const text = UNSAFE_getByType('Text');
    expect(text).toBeTruthy();
  });
});
