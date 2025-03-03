import React from 'react';
import {render} from '@testing-library/react-native';
import AMChart from './AMChart';
import {View, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';

describe('AMCharts Component', () => {
  it('renders the loading indicator when isLoading is true', () => {
    const {getByTestId} = render(<AMChart isLoading={true} />);
    const loadingIndicator = getByTestId('loading-indicator');
    expect(loadingIndicator).toBeTruthy();
  });

  it('renders the WebView with correct HTML when isLoading is false', () => {
    const mockConfig = {
      type: 'XYChart',
      data: [{category: 'A', value: 50}],
    };
    const {getByTestId} = render(
      <AMChart isLoading={false} config={mockConfig} type="XYChart" />,
    );
    const webView = getByTestId('chart-webview');
    expect(webView).toBeTruthy();
    expect(webView.props.source.html).toContain('am4core.createFromConfig');
    expect(webView.props.source.html).toContain('XYChart');
  });

  it('applies initial scale correctly in the WebView HTML', () => {
    const initialScale = 1.5;
    const mockConfig = {
      type: 'PieChart',
      data: [{category: 'A', value: 100}],
    };
    const {getByTestId} = render(
      <AMChart
        config={mockConfig}
        type="PieChart"
        initialScale={initialScale}
      />,
    );
    const webView = getByTestId('chart-webview');
    expect(webView.props.source.html).toContain(
      `initial-scale=${initialScale}`,
    );
  });

  it('renders custom style passed via props', () => {
    const customStyle = {height: 400};
    const {getByTestId} = render(<AMChart style={customStyle} />);
    const container = getByTestId('chart-container');
    expect(container.props.style).toContain(customStyle);
  });
});
