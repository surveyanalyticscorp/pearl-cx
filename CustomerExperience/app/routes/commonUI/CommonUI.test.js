import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {
  StatusIcon,
  CopyIcon,
  CalendarIcon,
  ResponsesIcon,
  RenderStatusIcon,
  StatusUI,
  RenderPriorityIcon,
  PriorityUI,
  CloseButton,
  SearchTextInput,
  SearchIcon,
  SaveDashboardDate,
  RenderRoundImageOrColor,
  NoItemsFound,
  ApplyButton,
  RenderSpinner,
  CheckBoxItem,
  CheckBox,
  RadioButtonCheckbox,
  CheckRadioButtonItem,
  EditTicket,
  DateIcon,
  FilterDateBox,
  Avatar,
  FilterIcon,
  ExclaimationIcon,
  SortIcon,
  RenderFilterCount,
  HeaderFilter,
} from './CommonUI';
import {Colors, statusColors} from '../../styles/color.constants';
import {useNavigation} from '@react-navigation/native';
import {color} from 'react-native-reanimated';
import {collapseTopMarginForChild} from 'react-native-render-html';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useNavigationState: jest.fn(),
  StackActions: {
    push: jest.fn(),
  },
}));

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mock MultilinguaUtils
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

describe('commonUI components', () => {
  test('should render StatusIcon correctly', () => {
    const {getByTestId} = render(
      <StatusIcon
        size={20}
        borderRadius={50}
        borderColor="red"
        fillerColor="blue"
      />,
    );
    const icon = getByTestId('status-icon');
    expect(icon.props.style.width).toBe(20);
    expect(icon.props.style.height).toBe(20);
    expect(icon.props.style.backgroundColor).toBe('blue');
  });

  test('should render CopyIcon correctly', () => {
    const {getByTestId} = render(<CopyIcon />);
    const image = getByTestId('image');
    expect(image).toBeTruthy();
    expect(image.props.style.width).toBe(12);
    expect(image.props.style.height).toBe(12);
  });

  test('should call onPress when CloseButton is clicked', () => {
    const mockGoBack = jest.fn();
    useNavigation.mockReturnValue({goBack: mockGoBack});
    const {getByTestId} = render(<CloseButton />);
    fireEvent.press(getByTestId('button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('should render ApplyButton and call onPress', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(<ApplyButton onPress={mockOnPress} />);
    const button = getByTestId('ApplyButton');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('should render NoItemsFound with correct message', () => {
    const {getByText} = render(<NoItemsFound>No data available</NoItemsFound>);
    expect(getByText('No data available')).toBeTruthy();
  });

  test('should render RenderPriorityIcon correctly', () => {
    const {getByTestId} = render(<RenderPriorityIcon title="high" />);
    const icon = getByTestId('icon');
    expect(icon).toBeTruthy();
  });

  test('should render and use SearchTextInput', () => {
    const mockOnChangeText = jest.fn();
    const {getByPlaceholderText} = render(
      <SearchTextInput placeholder="Search" onChangeText={mockOnChangeText} />,
    );
    fireEvent.changeText(getByPlaceholderText('Search'), 'test');
    expect(mockOnChangeText).toHaveBeenCalledWith('test');
  });

  test('should render Avatar correctly', () => {
    const {getByText} = render(<Avatar title="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  test('should render RenderSpinner correctly', () => {
    const {getByTestId} = render(<RenderSpinner />);
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  test('should render RadioButtonCheckbox correctly when checked', () => {
    const {getByTestId} = render(<RadioButtonCheckbox isChecked />);
    const radioButton = getByTestId('radio-button-checkbox');
    expect(radioButton.props.isChecked).toBeTruthy();
  });

  test('should render and use FilterIcon', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(<FilterIcon onPressFilter={mockOnPress} />);
    fireEvent.press(getByTestId('on-press-filter-icon'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('should render DateIcon correctly', () => {
    const {getByTestId} = render(<DateIcon />);
    const icon = getByTestId('icon-calendar');
    expect(icon).toBeTruthy();
  });

  test('should render SortIcon and call onPress', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(<SortIcon onPressFilter={mockOnPress} />);
    fireEvent.press(getByTestId('on-press-filter'));
    expect(mockOnPress).toHaveBeenCalled();
  });
  test('should render CalendarIcon correctly', () => {
    const {getByTestId} = render(<CalendarIcon />);
    const icon = getByTestId('image-calendar');
    expect(icon).toBeTruthy();
    expect(icon.props.width).toBe(12);
    expect(icon.props.height).toBe(12);
  });

  test('should render ResponsesIcon correctly', () => {
    const {getByTestId} = render(<ResponsesIcon />);
    const icon = getByTestId('image');
    expect(icon).toBeTruthy();
    expect(icon.props.style.width).toBe(12);
    expect(icon.props.style.height).toBe(12);
  });

  test('should render RenderStatusIcon correctly', () => {
    const {getByTestId} = render(<RenderStatusIcon title="open" />);
    const icon = getByTestId('render-status-icon');
    expect(icon).toBeTruthy();
    expect(icon.props.style.backgroundColor).toBe(statusColors.openFiller); // Assuming 'open' status gives a green background
  });

  test('should render StatusUI correctly', () => {
    const {getByText} = render(<StatusUI status={0} />);
    expect(getByText('New')).toBeTruthy(); // Replace with actual text rendered in StatusUI if different
  });

  test('should render PriorityUI correctly', () => {
    const {getByText} = render(<PriorityUI priority={0} />);
    expect(getByText('Low')).toBeTruthy(); // Replace with actual text rendered in PriorityUI if different
  });

  // test('should render and handle onPress for SearchIcon', () => {
  //   const mockOnPress = jest.fn();
  //   const {getByTestId} = render(<SearchIcon onPressSearch={mockOnPress} />);
  //   fireEvent.press(getByTestId('search-button'));
  //   expect(mockOnPress).toHaveBeenCalled();
  // });

  test('should render SaveDashboardDate correctly', () => {
    const {getByText} = render(<SaveDashboardDate />);
    expect(getByText('Apply')).toBeTruthy(); // Assuming SaveDashboardDate contains a 'Save' text
  });

  test('should render RenderRoundImageOrColor with a color', () => {
    const {getByTestId} = render(
      <RenderRoundImageOrColor
        data={{color: Colors.accentLight, borderColor: Colors.black}}
        size={50}
      />,
    );
    const roundComponent = getByTestId('round-color');
    expect(roundComponent).toBeTruthy();
    expect(roundComponent.props.style.backgroundColor).toBe(Colors.accentLight);
  });

  test('should render RenderRoundImageOrColor with a image', () => {
    const {getByTestId} = render(
      <RenderRoundImageOrColor
        data={{
          url: 'https://picsum.photos/200',
        }}
        size={50}
      />,
    );
    const roundComponent = getByTestId('round-image');
    expect(roundComponent).toBeTruthy();
  });

  test('should render CheckBoxItem and call onPress', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <CheckBoxItem
        item={{isChecked: false, title: 'test title'}}
        onPress={mockOnPress}
      />,
    );
    fireEvent.press(getByTestId('check-box-button'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('should render CheckBox and call onPress', () => {
    const {getByTestId} = render(
      <CheckBox
        isChecked
        checkedColor={Colors.accentLight}
        uncheckedColor={Colors.transparent}
      />,
    );
    const checkbox = getByTestId('checkbox');

    expect(checkbox).toBeTruthy();
  });

  test('should render CheckRadioButtonItem and handle onPress', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <CheckRadioButtonItem
        item={{isChecked: false, title: 'Test text'}}
        onPress={mockOnPress}
      />,
    );
    fireEvent.press(getByTestId('check-radio-button-item'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('should render FilterDateBox with correct date', () => {
    const {useSelector} = require('react-redux');
    const mockNavigation = {dispatch: jest.fn()};
    const {StackActions} = require('@react-navigation/native');

    useNavigation.mockReturnValue(mockNavigation);
    useSelector.mockReturnValue({
      startDate: '01/09/2024',
      endDate: '30/09/2024',
    });
    StackActions.push.mockReturnValue('pushAction');

    const {getByTestId} = render(<FilterDateBox />);
    expect(getByTestId('Filter-Date-Box')).toBeTruthy();
  });

  test('should render ExclaimationIcon correctly', () => {
    const {getByTestId} = render(<ExclaimationIcon />);
    const icon = getByTestId('exclaimation-icon');
    expect(icon).toBeTruthy();
  });

  test('should render RenderFilterCount with correct count', () => {
    const {getByText} = render(<RenderFilterCount filterCount={3} />);
    expect(getByText('Filters (3)')).toBeTruthy();
  });

  // test('should render HeaderFilter and call onPress', () => {
  //   const mockOnPress = jest.fn();
  //   const dateRange = {endDate: '21/8/2024', startDate: '21/02/2024', type: 5};
  //   const {getByTestId} = render(
  //     <HeaderFilter dateRange={dateRange} onPressDateRange={mockOnPress} />,
  //   );
  //   fireEvent.press(getByTestId('Filter-Date-Box'));
  //   expect(mockOnPress).toHaveBeenCalled();
  // });
});
