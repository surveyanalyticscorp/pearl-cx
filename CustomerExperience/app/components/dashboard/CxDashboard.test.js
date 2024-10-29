import React from 'react';
import {Provider} from 'react-redux';
import {render, fireEvent, act} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import configureStore from 'redux-mock-store';
import CxDashboard from './CxDashboard';
import {
  getDashboardContent,
  getFirstTimeClosedLoopSegmentDetails,
} from '../../redux/actions/dashboard.actions';

// Mock necessary components and utilities
jest.mock('./ClosedLoopDashboard', () => ({
  ClosedLoopDashboard: 'ClosedLoopDashboard',
  StatusDashboardBottomSheet: 'StatusDashboardBottomSheet',
}));

// mock HeaderFilter
jest.mock('../../routes/commonUI/CommonUI', () => ({
  HeaderFilter: 'HeaderFilter',
}));

// Mock actions
jest.mock('../../redux/actions/dashboard.actions', () => ({
  getDashboardContent: () => jest.fn(),
  getFirstTimeClosedLoopSegmentDetails: () => jest.fn(),
}));

// Mock necessary modules
jest.mock('victory-native', () => ({
  VictoryPie: () => 'VictoryPie',
}));

const mockStore = configureStore([]);

// Default props for CxDashboard
// const defaultProps = {

// dashboardData: state.dashboard.dashboardData,
// ticketCount: state.dashboard.dashBoardTicketCount,
// isLoading: state.global.isLoading,
// isError: state.global.isError,
// errorMessage: state.global.errorMessage,
// authToken: state.global.authToken,
// range: state.global.range,

// wantToReload: state.global.wantToReloadDashboard,

// segmentList: state.dashboard.segmentDetails.segments,
const defaultProps = {
  dashboardData: {},
  isLoading: false,
  error: null,
  onRefresh: jest.fn(),
  onRangeFilterChange: jest.fn(),
  range: {startDate: null, endDate: null},
};

const renderComponent = (initialState = {}, props = {}) => {
  //
  const store = mockStore({
    dashboard: {
      dashboardData: {},
      dashBoardTicketCount: 0,
      isLoading: false,
      ...initialState.dashboard,
      segmentDetails: {
        segments: [
          {segmentID: 1, segmentName: 'Segment 1'},
          {segmentID: 2, segmentName: 'Segment 2'},
        ],
      },
      currentSegment: {segmentID: 1, segmentName: 'Segment 1'},
    },
    global: {
      isLoading: false,
      isError: false,
      errorMessage: '',
      authToken: 'dummy-token',
      ...initialState.global,
    },
  });
  return render(
    <Provider store={store}>
      <SafeAreaProvider>
        <CxDashboard {...defaultProps} {...props} />
      </SafeAreaProvider>
    </Provider>,
  );
};

describe('CxDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Initial render tests
  test('renders CxDashboard correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('cx-dashboard-container')).toBeTruthy();
  });

  test('renders StatusDashboardBottomSheet component', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('status-dashboard-bottom-sheet')).toBeTruthy();
  });

  test('renders ClosedLoopDashboard component', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('closed-loop-dashboard')).toBeTruthy();
  });

  // State and Redux functionality tests
  test('fetches dashboard data on mount', () => {
    renderComponent();
    expect(getDashboardContent).toHaveBeenCalledTimes(1);
  });

  test('displays loading state correctly', () => {
    const {getByTestId} = renderComponent({isLoading: true});
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  test('displays an error message if dashboard data fetch fails', () => {
    const {getByText} = renderComponent({error: 'Error loading data'});
    expect(getByText('Error loading data')).toBeTruthy();
  });

  // Interaction tests
  test('handles refresh action', async () => {
    const {getByTestId} = renderComponent(
      {},
      {onRefresh: defaultProps.onRefresh},
    );
    await act(async () => {
      fireEvent.press(getByTestId('refresh-button'));
    });
    expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
  });

  test('opens and changes range filter', () => {
    const {getByTestId} = renderComponent(
      {},
      {onRangeFilterChange: defaultProps.onRangeFilterChange},
    );
    const rangeFilterButton = getByTestId('range-filter-button');
    fireEvent.press(rangeFilterButton);
    expect(defaultProps.onRangeFilterChange).toHaveBeenCalledWith('newRange');
  });

  // Add additional interaction and state tests as needed
});
