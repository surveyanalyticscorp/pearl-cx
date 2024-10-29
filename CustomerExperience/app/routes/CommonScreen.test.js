import React from 'react';
import {Alert, BackHandler} from 'react-native';
import {render, fireEvent} from '@testing-library/react-native';
import * as MultilinguaUtils from '../Utils/MultilinguaUtils';
import CommonScreens, {
  RenderExitAlert,
  CloseLoopTicketsTabs,
  DateRangeTabStack,
  TicketLogTabStack,
} from './CommonScreen';

// Mock the navigation libraries
jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn().mockReturnValue({
    Navigator: ({children}) => <>{children}</>,
    Screen: ({children}) => <>{children}</>,
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  TransitionPresets: {
    ModalPresentationIOS: {},
  },
}));

jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  exitApp: jest.fn(),
}));

// Mock translate to return expected translated values
jest.mock('../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => {
    const translations = {
      'dashboard.new': 'New',
      'dashboard.open': 'Open',
      'dashboard.escalated': 'Escalated',
      'dashboard.resolved': 'Resolved',
      'date_filter.month': 'Month',
      'date_filter.custom': 'Custom',
      'close_loop.overview': 'Overview',
      'close_loop.comments': 'Comments',
      'close_loop.logs': 'Logs',
      exit_app: 'Exit App',
      exit_message: 'Are you sure you want to exit?',
      yes: 'Yes',
      no: 'No',
    };
    return translations[key] || key;
  }),
}));

describe('CommonScreen components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RenderExitAlert', () => {
    it('should show exit alert with translated messages', () => {
      const mockShowExitAlert = jest.fn();
      jest.spyOn(Alert, 'alert');

      RenderExitAlert({showExitAlert: mockShowExitAlert});

      expect(Alert.alert).toHaveBeenCalledWith(
        'Exit App',
        'Are you sure you want to exit?',
        expect.arrayContaining([
          expect.objectContaining({
            text: 'Yes',
            onPress: expect.any(Function),
          }),
          expect.objectContaining({
            text: 'No',
            onPress: expect.any(Function),
          }),
        ]),
        {cancelable: false},
      );
    });

    it('should call BackHandler.exitApp on "yes" press', () => {
      const mockShowExitAlert = jest.fn();
      jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, buttons) => {
          buttons[0].onPress(); // Simulate "yes" button press
        });

      RenderExitAlert({showExitAlert: mockShowExitAlert});
      expect(mockShowExitAlert).toHaveBeenCalledWith(false);
      expect(BackHandler.exitApp).toHaveBeenCalled();
    });

    it('should hide alert on "no" press', () => {
      const mockShowExitAlert = jest.fn();
      jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, buttons) => {
          buttons[1].onPress(); // Simulate "no" button press
        });

      RenderExitAlert({showExitAlert: mockShowExitAlert});
      expect(mockShowExitAlert).toHaveBeenCalledWith(false);
    });
  });

  describe('CloseLoopTicketsTabs', () => {
    it('should render CloseLoopTicketsTab with correct screens', () => {
      const {getByText} = render(<CloseLoopTicketsTabs />);

      expect(getByText(new RegExp('New', 'i'))).toBeTruthy();
      expect(getByText(new RegExp('Open', 'i'))).toBeTruthy();
      expect(getByText(new RegExp('Escalated', 'i'))).toBeTruthy();
      expect(getByText(new RegExp('Resolved', 'i'))).toBeTruthy();
    });
  });

  describe('DateRangeTabStack', () => {
    it('should render DateRangeTabStack with correct screens', () => {
      const mockRoute = {
        params: {
          range: 'last_month',
          setRange: jest.fn(),
        },
      };
      const {getByText} = render(<DateRangeTabStack route={mockRoute} />);

      expect(getByText(new RegExp('Month', 'i'))).toBeTruthy();
      expect(getByText(new RegExp('Custom', 'i'))).toBeTruthy();
    });
  });

  describe('TicketLogTabStack', () => {
    it('should render TicketLogTabStack with correct screens', () => {
      const mockRoute = {
        params: {
          ticketID: '123',
          parentRoute: 'Home',
        },
      };
      const {getByText} = render(<TicketLogTabStack route={mockRoute} />);

      expect(getByText(new RegExp('Overview', 'i'))).toBeTruthy();
      expect(getByText(new RegExp('Comments', 'i'))).toBeTruthy();
      expect(getByText(new RegExp('Logs', 'i'))).toBeTruthy();
    });
  });

  describe('CommonScreens', () => {
    it('should return an array of RootStack screens', () => {
      const mockRootStack = {
        Screen: jest.fn(({children}) => <>{children}</>),
      };
      const screens = CommonScreens(mockRootStack);

      const screenNames = screens.map(screen => screen.props.name);
      expect(screenNames).toContain('TicketDetails');
      expect(screenNames).toContain('responses.new_ticket');
      expect(screenNames).toContain('SelectEmailTemplate');
      expect(screenNames).toContain('sendEmail');
      expect(screenNames).toContain('actionEmailHistory');
    });
  });
});

describe('CloseLoopTicketsTabs', () => {
  it('should render CloseLoopTicketsTab with correct screens', () => {
    const {getByText, debug} = render(<CloseLoopTicketsTabs />);
    debug(); // Outputs the entire rendered component structure for inspection
  });
});
