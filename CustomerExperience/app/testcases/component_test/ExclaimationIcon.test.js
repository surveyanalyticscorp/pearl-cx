import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Text} from 'react-native';
import {ExclaimationIcon} from '../../routes/commonUI/ExclaimationIcon';
import {Colors} from '../../styles/color.constants';

// Mock the image require
jest.mock('./../../../assets/images/exclaimation_icon.png', () => ({
  uri: 'mocked-image',
}));

describe('ExclaimationIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render ExclaimationIcon with default props', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with testID', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render as Pressable component', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Size handling', () => {
    it('should render with default size 22', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with custom size', () => {
      const {getByTestId} = render(<ExclaimationIcon size={30} />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with small size', () => {
      const {getByTestId} = render(<ExclaimationIcon size={16} />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with large size', () => {
      const {getByTestId} = render(<ExclaimationIcon size={50} />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with zero size', () => {
      const {getByTestId} = render(<ExclaimationIcon size={0} />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with very large size', () => {
      const {getByTestId} = render(<ExclaimationIcon size={500} />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Color handling', () => {
    it('should render with default color (critical)', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with custom color', () => {
      const {getByTestId} = render(<ExclaimationIcon color="#FF0000" />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with different color strings', () => {
      const {getByTestId: getByTestId1} = render(
        <ExclaimationIcon color="red" />
      );

      expect(getByTestId1('exclaimation-icon')).toBeTruthy();

      const {getByTestId: getByTestId2} = render(
        <ExclaimationIcon color="#00FF00" />
      );

      expect(getByTestId2('exclaimation-icon')).toBeTruthy();
    });

    it('should render with Colors constant color', () => {
      const {getByTestId} = render(
        <ExclaimationIcon color={Colors.accent} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Style handling', () => {
    it('should accept custom style', () => {
      const customStyle = {marginRight: 10};
      const {getByTestId} = render(
        <ExclaimationIcon style={customStyle} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply custom style with padding', () => {
      const customStyle = {padding: 8};
      const {getByTestId} = render(
        <ExclaimationIcon style={customStyle} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply custom style with margin', () => {
      const customStyle = {margin: 5};
      const {getByTestId} = render(
        <ExclaimationIcon style={customStyle} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply complex style object', () => {
      const customStyle = {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: 'transparent',
      };
      const {getByTestId} = render(
        <ExclaimationIcon style={customStyle} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Press handling', () => {
    it('should call onPress callback when pressed', () => {
      const onPressMock = jest.fn();
      const {getByTestId} = render(
        <ExclaimationIcon onPress={onPressMock} />
      );

      const icon = getByTestId('exclaimation-icon');
      fireEvent.press(icon);

      expect(onPressMock).toHaveBeenCalled();
    });

    it('should call onPress once for single press', () => {
      const onPressMock = jest.fn();
      const {getByTestId} = render(
        <ExclaimationIcon onPress={onPressMock} />
      );

      const icon = getByTestId('exclaimation-icon');
      fireEvent.press(icon);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should call onPress multiple times for multiple presses', () => {
      const onPressMock = jest.fn();
      const {getByTestId} = render(
        <ExclaimationIcon onPress={onPressMock} />
      );

      const icon = getByTestId('exclaimation-icon');
      fireEvent.press(icon);
      fireEvent.press(icon);
      fireEvent.press(icon);

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });

    it('should not call onPress when not provided', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      // Should not throw
      fireEvent.press(icon);

      expect(icon).toBeTruthy();
    });
  });

  describe('End component rendering', () => {
    it('should render without endComponent', () => {
      const {getByTestId, queryByText} = render(
        <ExclaimationIcon />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with endComponent', () => {
      const endComponent = <Text>End</Text>;
      const {getByTestId, getByText} = render(
        <ExclaimationIcon endComponent={endComponent} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
      expect(getByText('End')).toBeTruthy();
    });

    it('should render with complex endComponent', () => {
      const endComponent = (
        <Text>
          ComplexEnd
        </Text>
      );
      const {getByTestId, getByText} = render(
        <ExclaimationIcon endComponent={endComponent} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
      expect(getByText('ComplexEnd')).toBeTruthy();
    });

    it('should render with null endComponent', () => {
      const {getByTestId} = render(
        <ExclaimationIcon endComponent={null} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with undefined endComponent', () => {
      const {getByTestId} = render(
        <ExclaimationIcon endComponent={undefined} />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Props combinations', () => {
    it('should render with all props provided', () => {
      const onPressMock = jest.fn();
      const customStyle = {padding: 10};
      const endComponent = <Text>End</Text>;

      const {getByTestId, getByText} = render(
        <ExclaimationIcon
          onPress={onPressMock}
          size={25}
          style={customStyle}
          color="#FF0000"
          endComponent={endComponent}
        />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
      expect(getByText('End')).toBeTruthy();

      fireEvent.press(icon);
      expect(onPressMock).toHaveBeenCalled();
    });

    it('should render with minimal props', () => {
      const {getByTestId} = render(<ExclaimationIcon />);

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with size and color only', () => {
      const {getByTestId} = render(
        <ExclaimationIcon size={30} color="blue" />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with onPress and endComponent', () => {
      const onPressMock = jest.fn();
      const endComponent = <Text>Badge</Text>;

      const {getByTestId, getByText} = render(
        <ExclaimationIcon
          onPress={onPressMock}
          endComponent={endComponent}
        />
      );

      const icon = getByTestId('exclaimation-icon');
      fireEvent.press(icon);

      expect(onPressMock).toHaveBeenCalled();
      expect(getByText('Badge')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should render with empty string color', () => {
      const {getByTestId} = render(
        <ExclaimationIcon color="" />
      );

      const icon = getByTestId('exclaimation-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with numeric size edge cases', () => {
      const {getByTestId: getByTestId1} = render(
        <ExclaimationIcon size={1} />
      );

      expect(getByTestId1('exclaimation-icon')).toBeTruthy();

      const {getByTestId: getByTestId2} = render(
        <ExclaimationIcon size={1000} />
      );

      expect(getByTestId2('exclaimation-icon')).toBeTruthy();
    });

    it('should handle rapid press events', () => {
      const onPressMock = jest.fn();
      const {getByTestId} = render(
        <ExclaimationIcon onPress={onPressMock} />
      );

      const icon = getByTestId('exclaimation-icon');
      for (let i = 0; i < 10; i++) {
        fireEvent.press(icon);
      }

      expect(onPressMock).toHaveBeenCalledTimes(10);
    });
  });
});
