import {AppState} from 'react-native';
import AppTimeTracker from './AppTimeTracker';

jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(),
  },
}));

describe('AppTimeTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Reset the tracker state
    AppTimeTracker.totalTime = 0;
    AppTimeTracker.startTime = null;
    AppTimeTracker.onTimeUpdate = null;
    AppTimeTracker.listener = null;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with zero total time', () => {
    expect(AppTimeTracker.totalTime).toBe(0);
    expect(AppTimeTracker.startTime).toBeNull();
  });

  it('should register AppState listener when started', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);

    expect(AppState.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should set startTime when app becomes active', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);

    // Get the handler that was registered
    const handler = AppState.addEventListener.mock.calls[0][1];

    // Simulate app becoming active
    const beforeTime = Date.now();
    handler('active');
    const afterTime = Date.now();

    expect(AppTimeTracker.startTime).toBeGreaterThanOrEqual(beforeTime);
    expect(AppTimeTracker.startTime).toBeLessThanOrEqual(afterTime);
  });

  it('should accumulate time when app goes to background', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);
    const handler = AppState.addEventListener.mock.calls[0][1];

    // App becomes active
    handler('active');
    const startTime = AppTimeTracker.startTime;

    // Advance time
    jest.advanceTimersByTime(5000);

    // App goes to background
    handler('background');

    expect(AppTimeTracker.totalTime).toBeGreaterThan(0);
    expect(AppTimeTracker.startTime).toBeNull();
  });

  it('should call onTimeUpdate callback when app goes to background', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);
    const handler = AppState.addEventListener.mock.calls[0][1];

    // App becomes active
    handler('active');

    // Advance time
    jest.advanceTimersByTime(3000);

    // App goes to background
    handler('background');

    expect(mockCallback).toHaveBeenCalledWith(
      expect.any(Number),
    );
    expect(mockCallback.mock.calls[0][0]).toBeGreaterThan(0);
  });

  it('should not call onTimeUpdate if callback is null', () => {
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    // Start without callback
    AppTimeTracker.start(null);
    const handler = AppState.addEventListener.mock.calls[0][1];

    // App becomes active
    handler('active');

    // Advance time
    jest.advanceTimersByTime(2000);

    // App goes to background - should not crash
    expect(() => {
      handler('background');
    }).not.toThrow();
  });

  it('should not accumulate time if startTime is null when going to background', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);
    const handler = AppState.addEventListener.mock.calls[0][1];

    const initialTotalTime = AppTimeTracker.totalTime;

    // Go to background without being active first
    handler('background');

    expect(AppTimeTracker.totalTime).toBe(initialTotalTime);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should accumulate multiple time periods', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);
    const handler = AppState.addEventListener.mock.calls[0][1];

    // First period
    handler('active');
    jest.advanceTimersByTime(2000);
    handler('background');

    const firstPeriodTime = AppTimeTracker.totalTime;

    // Second period
    handler('active');
    jest.advanceTimersByTime(3000);
    handler('background');

    const secondPeriodTime = AppTimeTracker.totalTime;

    expect(secondPeriodTime).toBeGreaterThan(firstPeriodTime);
    expect(secondPeriodTime - firstPeriodTime).toBeGreaterThan(0);
  });

  it('should remove listener when stopped', () => {
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(jest.fn());
    AppTimeTracker.stop();

    expect(mockListener.remove).toHaveBeenCalled();
  });

  it('should not crash if stop is called without listener', () => {
    expect(() => {
      AppTimeTracker.stop();
    }).not.toThrow();
  });

  it('should handle app state changes: active -> inactive -> background', () => {
    const mockCallback = jest.fn();
    const mockListener = {remove: jest.fn()};
    AppState.addEventListener.mockReturnValue(mockListener);

    AppTimeTracker.start(mockCallback);
    const handler = AppState.addEventListener.mock.calls[0][1];

    handler('active');
    jest.advanceTimersByTime(1000);

    // Inactive state - should not trigger accumulation
    handler('inactive');
    const timeAfterInactive = AppTimeTracker.totalTime;

    jest.advanceTimersByTime(2000);

    handler('background');
    const timeAfterBackground = AppTimeTracker.totalTime;

    // Time should be accumulated when going to background
    expect(timeAfterBackground).toBeGreaterThanOrEqual(timeAfterInactive);
  });
});
