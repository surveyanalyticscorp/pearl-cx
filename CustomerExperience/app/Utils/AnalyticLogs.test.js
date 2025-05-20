import {sendAnalyticsEvent, appendUserInfoToEventParams} from './AnalyticLogs';

// Mock Firebase Analytics
const mockLogEvent = jest.fn();
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: () => ({
    logEvent: mockLogEvent,
  }),
}));

// Mock console.log to prevent test output noise
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('AnalyticLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendAnalyticsEvent', () => {
    it('should send event to firebase analytics with correct parameters', () => {
      // Arrange
      const eventName = 'test_event';
      const eventParams = {
        param1: 'value1',
        param2: 'value2',
      };

      // Act
      sendAnalyticsEvent(eventName, eventParams);

      // Assert
      expect(mockLogEvent).toHaveBeenCalledWith(eventName, eventParams);
      expect(console.log).toHaveBeenCalledWith(
        'Firebase Analytics event name - ',
        eventName,
      );
      expect(console.log).toHaveBeenCalledWith(
        'Firebase Analytics event params - ',
        eventParams,
      );
    });

    it('should handle empty event parameters', () => {
      // Arrange
      const eventName = 'test_event';
      const eventParams = {};

      // Act
      sendAnalyticsEvent(eventName, eventParams);

      // Assert
      expect(mockLogEvent).toHaveBeenCalledWith(eventName, eventParams);
    });

    it('should handle null event parameters', () => {
      // Arrange
      const eventName = 'test_event';

      // Act
      sendAnalyticsEvent(eventName, null);

      // Assert
      expect(mockLogEvent).toHaveBeenCalledWith(eventName, null);
    });
  });

  describe('appendUserInfoToEventParams', () => {
    it('should append user info to event params when all required fields are present', () => {
      // Arrange
      const appUser = {
        ID: 1,
        appVersion: '1.0.0',
        panelID: 123,
      };

      // Act
      const result = appendUserInfoToEventParams(appUser);

      // Assert
      expect(result).toEqual({
        userID: '1',
        appVersion: '1.0.0',
        panelID: '123',
      });
    });

    it('should return undefined when required fields are missing', () => {
      // Arrange
      const appUser = {
        ID: 1,
        // Missing appVersion and panelID
      };

      // Act
      const result = appendUserInfoToEventParams(appUser);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined when appUser is null', () => {
      // Act
      const result = appendUserInfoToEventParams(null);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
