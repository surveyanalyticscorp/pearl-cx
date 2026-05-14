import React from 'react';
import {render} from '@testing-library/react-native';
import ActivityText from './ActivityText';

jest.mock('react-native-render-html', () => ({
  __esModule: true,
  defaultSystemFonts: [],
  default: ({source}) => {
    const {Text} = require('react-native');
    return <Text testID="render-html">{source.html}</Text>;
  },
}));

jest.mock('../../Utils/StringUtils', () => ({
  formatActivityToHTML: jest.fn(text => text || ''),
}));

jest.mock('../../Utils/TicketUtils', () => ({
  wordsToBold: [],
}));

describe('ActivityText', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<ActivityText text="Some activity" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the RenderHTML component', () => {
    const {getByTestId} = render(<ActivityText text="activity text" />);
    expect(getByTestId('render-html')).toBeTruthy();
  });

  it('passes html content derived from text prop to RenderHTML', () => {
    const StringUtils = require('../../Utils/StringUtils');
    StringUtils.formatActivityToHTML.mockReturnValue('formatted-html');
    const {getByTestId} = render(<ActivityText text="raw text" />);
    const html = getByTestId('render-html').props.children;
    expect(html).toContain('formatted-html');
  });

  it('renders without crashing when text is undefined', () => {
    const {toJSON} = render(<ActivityText />);
    expect(toJSON()).toBeTruthy();
  });
});
