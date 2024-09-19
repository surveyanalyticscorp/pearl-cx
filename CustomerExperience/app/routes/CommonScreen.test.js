import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import DismissKeyboard from './commonUI/DismissKeyboard';
import FabAddButton from './commonUI/FabAddButton';
import IconButton from './commonUI/IconButton';
import {Colors} from '../styles/color.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MenuIcon from './commonUI/MenuIcon';
import IndicatorIcon from './commonUI/IndicatorIcon';
import PageHeaderText from './commonUI/PageHeaderText';
import GestureHandleBar from './commonUI/GestureHandleBar';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import {Keyboard, Text} from 'react-native';
import {Alert, BackHandler} from 'react-native';
import {RenderExitAlert} from './CommonScreen';
import {translate} from './MultilinguaUtils';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  DrawerActions: {
    toggleDrawer: jest.fn(),
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
};

describe('CommonScreen Components', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue(mockNavigation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('FabAddButton renders correctly and handles press', () => {
    const {getByRole} = render(
      <FabAddButton onPress={mockNavigation.navigate} />,
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  test('IconButton renders correctly with left and right icons', () => {
    const leftIcon = (
      <IonIcons name="arrow-back" size={20} color={Colors.black} />
    );
    const rightIcon = (
      <IonIcons name="arrow-forward" size={20} color={Colors.black} />
    );
    const {getByText} = render(
      <IconButton
        buttonText="Click Me"
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onPress={mockNavigation.navigate}
      />,
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  test('GestureHandleBar renders correctly', () => {
    const {getByTestId} = render(<GestureHandleBar />);
    expect(getByTestId('gesture-handle-bar')).toBeTruthy();
  });

  test('PageHeaderText renders correctly with text', () => {
    const {getByText} = render(<PageHeaderText text="Header Text" />);
    expect(getByText('Header Text')).toBeTruthy();
  });

  test('PageHeaderText does not render close button when hasCloseButton is false', () => {
    const {queryByTestId} = render(
      <PageHeaderText text="Header Text" hasCloseButton={false} />,
    );
    expect(queryByTestId('close-button')).toBeNull();
  });

  test('IndicatorIcon renders correctly with given props', () => {
    const {getByTestId} = render(
      <IndicatorIcon name="checkmark" color={Colors.green} size={20} />,
    );
    expect(getByTestId('indicator-icon')).toBeTruthy();
  });

  test('MenuIcon renders correctly and handles press', () => {
    const {getByRole} = render(<MenuIcon />);
    const button = getByRole('button');
    fireEvent.press(button);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith(
      DrawerActions.toggleDrawer(),
    );
  });

  test('HeaderBackLeft renders correctly and handles press', () => {
    const {getByRole} = render(<HeaderBackLeft />);
    const button = getByRole('button');
    fireEvent.press(button);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test('HeaderBackLeft handles press without route params', () => {
    const props = {};
    const {getByRole} = render(<HeaderBackLeft {...props} />);
    const button = getByRole('button');
    fireEvent.press(button);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test('DismissKeyboard dismisses keyboard on press', () => {
    Keyboard.dismiss = jest.fn();
    const {getByRole} = render(
      <DismissKeyboard>
        <Text>Child Component</Text>
      </DismissKeyboard>,
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });
});

describe('RenderExitAlert', () => {
  const showExitAlertMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display an alert with "yes" and "no" buttons', () => {
    render(<RenderExitAlert showExitAlert={showExitAlertMock} />);

    expect(Alert.alert).toHaveBeenCalledWith(
      'exit_app',
      'exit_message',
      [
        {
          text: 'yes',
          onPress: expect.any(Function),
        },
        {
          text: 'no',
          onPress: expect.any(Function),
        },
      ],
      {cancelable: false},
    );
  });

  it('should call BackHandler.exitApp when "yes" is pressed', () => {
    render(<RenderExitAlert showExitAlert={showExitAlertMock} />);

    const yesButton = Alert.alert.mock.calls[0][2][0];
    yesButton.onPress();

    expect(showExitAlertMock).toHaveBeenCalledWith(false);
    expect(BackHandler.exitApp).toHaveBeenCalled();
  });

  it('should not call BackHandler.exitApp when "no" is pressed', () => {
    render(<RenderExitAlert showExitAlert={showExitAlertMock} />);

    const noButton = Alert.alert.mock.calls[0][2][1];
    noButton.onPress();

    expect(showExitAlertMock).toHaveBeenCalledWith(false);
    expect(BackHandler.exitApp).not.toHaveBeenCalled();
  });
});
