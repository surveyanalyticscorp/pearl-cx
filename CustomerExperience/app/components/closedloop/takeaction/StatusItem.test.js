import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import StatusItem from './StatusItem'; // Adjust the import path as needed

describe('StatusItem Component', () => {
  const mockOnPressHandler = jest.fn();
  const item = {title: 'Test Status'};
  const selectedIndex = 1;

  test('renders correctly', () => {
    const {getByTestId, getByText} = render(
      <StatusItem
        index={0}
        item={item}
        selectedIndex={selectedIndex}
        onPressHandler={mockOnPressHandler}
      />,
    );

    // Check if RadioButtonCheckbox is rendered with the correct testID
    const radioButtonCheckbox = getByTestId('radio-button-checkbox');
    expect(radioButtonCheckbox).toBeTruthy();

    // Check if TextLabel is rendered with the correct testID and text
    const textLabel = getByTestId('text-label');
    expect(textLabel).toBeTruthy();
    expect(getByText('Test Status')).toBeTruthy();

    // Check if RenderStatusIcon is rendered with the correct testID
    const renderStatusIcon = getByTestId('render-status-icon');
    expect(renderStatusIcon).toBeTruthy();
  });

  test('calls onPressHandler when pressed', () => {
    const {getByTestId} = render(
      <StatusItem
        index={0}
        item={item}
        selectedIndex={selectedIndex}
        onPressHandler={mockOnPressHandler}
      />,
    );

    // Simulate a press on the TouchableWithoutFeedback
    const touchable = getByTestId('radio-button-checkbox').parent;
    fireEvent.press(touchable);

    expect(mockOnPressHandler).toHaveBeenCalledTimes(1);
  });

  test('RadioButtonCheckbox reflects the correct state', () => {
    const {getByTestId, rerender} = render(
      <StatusItem
        index={1}
        item={item}
        selectedIndex={selectedIndex}
        onPressHandler={mockOnPressHandler}
      />,
    );

    // Initially, the index matches the selectedIndex, so it should be checked
    let radioButtonCheckbox = getByTestId('radio-button-checkbox');
    console.log(
      ' console log isChecked: ',
      JSON.stringify(radioButtonCheckbox.props),
    );

    expect(radioButtonCheckbox.props.isChecked).toBe(true);

    // Re-render with different selectedIndex
    rerender(
      <StatusItem
        index={0}
        item={item}
        selectedIndex={selectedIndex}
        onPressHandler={mockOnPressHandler}
      />,
    );

    // Now, the index does not match the selectedIndex, so it should not be checked
    radioButtonCheckbox = getByTestId('radio-button-checkbox');
    expect(radioButtonCheckbox.props.isChecked).toBe(false);
  });
});
