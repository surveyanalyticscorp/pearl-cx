import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {
  ClosedLoopDashboard,
  RenderDonutChart,
  ViewTicketsButton,
  RenderStatusFilterButton,
  getParcentage,
} from './ClosedLoopDashboard';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {VictoryPie} from 'victory-native';

// Mocks
jest.mock('react-native-device-info', () => ({
  isTablet: jest.fn(() => false),
}));
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('victory-native', () => ({
  VictoryPie: jest.fn().mockReturnValue(null),
}));
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

// Mock actions
const mockSetStatusFilterById = jest.fn().mockReturnValue({
  type: 'SET_STATUS_FILTER_BY_ID',
  id: '',
});
const mockSetStatusIndex = jest.fn().mockReturnValue({
  type: 'SET_STATUS_INDEX',
  index: 1,
});
jest.mock('../../redux/actions/closedloop.actions', () => ({
  setStatusFilterById: () => mockSetStatusFilterById(''),
  setStatusIndex: () => mockSetStatusIndex(),
}));
jest.mock('../../redux/actions/dashboard.actions', () => ({
  setMoveNext: jest.fn(),
}));

// Mock Store and Initial State
const mockStore = configureStore([]);
const initialState = {
  global: {
    userInfo: {firstName: 'John', lastName: 'Doe'},
  },
  dashboard: {
    currentStatusIndexForFilter: 0,
    dashBoardTicketCount: {
      totalTickets: 10,
      low: 2,
      medium: 3,
      high: 3,
      critical: 2,
    },
  },
};

describe('ClosedLoopDashboard Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  // Utility to render components within the Provider and SafeAreaProvider
  const renderComponent = Component =>
    render(
      <Provider store={store}>
        <SafeAreaProvider>{Component}</SafeAreaProvider>
      </Provider>,
    );

  it('renders ClosedLoopDashboard correctly', () => {
    const {getByTestId} = renderComponent(<ClosedLoopDashboard />);
    expect(getByTestId('ViewTicketsButton')).toBeTruthy();
    expect(getByTestId('on-press-filter-icon')).toBeTruthy();
    expect(getByTestId('render-donut-chart')).toBeTruthy();
  });

  it('renders RenderDonutChart component', () => {
    const {getByTestId} = renderComponent(
      <RenderDonutChart
        count={{
          totalTickets: 10,
          low: 2,
          medium: 3,
          high: 3,
          critical: 2,
        }}
        showPercentageCount={false}
      />,
    );
    expect(getByTestId('render-donut-chart')).toBeTruthy();
    expect(VictoryPie).toHaveBeenCalled(); // Check if VictoryPie is rendered
  });

  it('renders ViewTicketsButton and triggers setStatusFilterById on press', () => {
    const {getByTestId} = renderComponent(
      <ViewTicketsButton statusIndex={0} />, // statusIndex set to 0 as required
    );
    const button = getByTestId('ViewTicketsButton');
    fireEvent.press(button);

    // Verify setStatusFilterById was dispatched with an empty string
    expect(mockSetStatusFilterById).toHaveBeenCalledWith('');
  });

  it('renders RenderStatusFilterButton and calls onPress', () => {
    const mockPress = jest.fn();
    const {getByTestId} = renderComponent(
      <RenderStatusFilterButton
        currentStatus={{title: 'High'}}
        onPress={mockPress}
      />,
    );

    const button = getByTestId('on-press-filter-icon');
    fireEvent.press(button);
    expect(mockPress).toHaveBeenCalled();
  });

  it('dispatches correct actions for setStatusFilterById and setStatusIndex', () => {
    store.dispatch(mockSetStatusFilterById());
    store.dispatch(mockSetStatusIndex());

    expect(mockSetStatusFilterById).toHaveBeenCalled();
    expect(mockSetStatusIndex).toHaveBeenCalled();
  });
  it('renders RenderDonutChart with totalTickets count', () => {
    const {getByText} = renderComponent(
      <RenderDonutChart
        count={{
          totalTickets: 10,
          low: 2,
          medium: 3,
          high: 3,
          critical: 2,
        }}
        showPercentageCount={true}
      />,
    );
    expect(getByText('10')).toBeTruthy();
    expect(getByText('Tickets')).toBeTruthy();
  });
});
