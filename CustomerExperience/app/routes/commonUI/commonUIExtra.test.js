import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Keyboard} from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  DrawerActions: {
    toggleDrawer: jest.fn(() => ({type: 'TOGGLE_DRAWER'})),
  },
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({children}) => children,
}));
jest.mock('../../Utils/IconUtils', () => ({
  MaterialIcons: () => null,
}));
jest.mock('../../widgets/TextLabel/TextLabel', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text>{text}</Text>;
});
jest.mock('./CommonUI', () => ({
  CloseButton: ({onPressClose}) => {
    const {Pressable} = require('react-native');
    return <Pressable testID="close-btn" onPress={onPressClose} />;
  },
}));

import {useNavigation} from '@react-navigation/native';
import DismissKeyboard from './DismissKeyboard';
import MenuIcon from './MenuIcon';
import DrawerBackground from './DrawerBackground';
import FabAddButton from './FabAddButton';
import NotificationIcon from './NotificationIcon';
import HeaderBackLeft from './HeaderBackLeft';
import {SearchIcon} from './SearchIcon';
import EmptyList from './EmptyList';
import BottomSheetHeader, {
  PanelHandler,
  CloseButton as BSCloseButton,
  TitleAndCloseButton,
} from './BottomSheetHeader';
import {PageHeaderText} from './PageHeaderText';
import {RenderStatusIcon} from './status/RenderStatusIcon';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();

beforeEach(() => {
  useNavigation.mockReturnValue({
    navigate: mockNavigate,
    goBack: mockGoBack,
    dispatch: mockDispatch,
  });
  jest.clearAllMocks();
});

describe('DismissKeyboard', () => {
  it('renders children', () => {
    const {Text} = require('react-native');
    const {getByText} = render(
      <DismissKeyboard>
        <Text>Child</Text>
      </DismissKeyboard>,
    );
    expect(getByText('Child')).toBeTruthy();
  });

  it('calls Keyboard.dismiss on press', () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
    const {Text} = require('react-native');
    const {UNSAFE_getByType} = render(
      <DismissKeyboard>
        <Text>Child</Text>
      </DismissKeyboard>,
    );
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(dismissSpy).toHaveBeenCalled();
  });
});

describe('MenuIcon', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<MenuIcon />);
    expect(toJSON()).toBeTruthy();
  });

  it('dispatches toggleDrawer on press', () => {
    const {DrawerActions} = require('@react-navigation/native');
    const {UNSAFE_getByType} = render(<MenuIcon />);
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(DrawerActions.toggleDrawer).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });
});

describe('DrawerBackground', () => {
  it('renders children with drawer-container testID', () => {
    const {Text} = require('react-native');
    const {getByTestId, getByText} = render(
      <DrawerBackground>
        <Text>Drawer child</Text>
      </DrawerBackground>,
    );
    expect(getByTestId('drawer-container')).toBeTruthy();
    expect(getByText('Drawer child')).toBeTruthy();
  });
});

describe('FabAddButton', () => {
  it('renders the fab button', () => {
    const {getByTestId} = render(<FabAddButton onPress={jest.fn()} />);
    expect(getByTestId('fab-button')).toBeTruthy();
  });

  it('calls onPress when fab button pressed', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(<FabAddButton onPress={onPress} />);
    fireEvent.press(getByTestId('fab-button'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('NotificationIcon', () => {
  it('renders without badge when count is 0', () => {
    const {queryByText} = render(<NotificationIcon notificationCount={0} />);
    expect(queryByText('0')).toBeNull();
  });

  it('renders badge with count when count > 0', () => {
    const {getByText} = render(<NotificationIcon notificationCount={5} />);
    expect(getByText('5')).toBeTruthy();
  });

  it('navigates to Notifications on press', () => {
    const {UNSAFE_getByType} = render(<NotificationIcon notificationCount={0} />);
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(mockNavigate).toHaveBeenCalledWith('Notifications');
  });
});

describe('HeaderBackLeft', () => {
  it('calls navigation.goBack() when no route params', () => {
    const {UNSAFE_getByType} = render(<HeaderBackLeft />);
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('calls route.params.onBackPress when present', () => {
    const onBackPress = jest.fn();
    const props = {route: {params: {onBackPress}}};
    const {UNSAFE_getByType} = render(<HeaderBackLeft {...props} />);
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(onBackPress).toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});

describe('SearchIcon', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<SearchIcon />);
    expect(toJSON()).toBeTruthy();
  });

  it('navigates to Search Response on press', () => {
    const {getByTestId} = render(<SearchIcon />);
    fireEvent.press(getByTestId('search-button'));
    expect(mockNavigate).toHaveBeenCalledWith('Search Response');
  });
});

describe('EmptyList', () => {
  it('renders children text', () => {
    const {getByText} = render(<EmptyList>No items found</EmptyList>);
    expect(getByText('No items found')).toBeTruthy();
  });

  it('applies custom style prop', () => {
    const {getByText} = render(
      <EmptyList style={{backgroundColor: 'red'}}>Items</EmptyList>,
    );
    expect(getByText('Items')).toBeTruthy();
  });

  it('applies custom fontStyle prop', () => {
    const {getByText} = render(
      <EmptyList fontStyle={{fontSize: 20}}>Items</EmptyList>,
    );
    expect(getByText('Items')).toBeTruthy();
  });
});

describe('BottomSheetHeader', () => {
  it('renders PanelHandler with panelHandler testID', () => {
    const {getByTestId} = render(<PanelHandler />);
    expect(getByTestId('panelHandler')).toBeTruthy();
  });

  it('renders BSCloseButton and calls onPressClose', () => {
    const onPressClose = jest.fn();
    const {getByTestId} = render(<BSCloseButton onPressClose={onPressClose} />);
    fireEvent.press(getByTestId('close-button'));
    expect(onPressClose).toHaveBeenCalled();
  });

  it('renders TitleAndCloseButton with title', () => {
    const {getByText} = render(
      <TitleAndCloseButton title="Settings" onPressClose={jest.fn()} />,
    );
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders BottomSheetHeader default with title and close', () => {
    const onPressClose = jest.fn();
    const {getByTestId, getByText} = render(
      <BottomSheetHeader title="Filter" onPressClose={onPressClose} />,
    );
    expect(getByTestId('bottomSheetHeader')).toBeTruthy();
    expect(getByText('Filter')).toBeTruthy();
  });
});

describe('PageHeaderText', () => {
  it('renders header text without close button', () => {
    const {getByText, queryByTestId} = render(
      <PageHeaderText text="My Header" />,
    );
    expect(getByText('My Header')).toBeTruthy();
    expect(queryByTestId('close-btn')).toBeNull();
  });

  it('renders close button when hasCloseButton=true', () => {
    const {getByTestId} = render(
      <PageHeaderText text="Settings" hasCloseButton={true} />,
    );
    expect(getByTestId('close-btn')).toBeTruthy();
  });
});

describe('RenderStatusIcon', () => {
  it('renders for unknown/fallback status', () => {
    const {getByTestId} = render(<RenderStatusIcon title="unknown" />);
    expect(getByTestId('render-status-icon')).toBeTruthy();
  });
});
