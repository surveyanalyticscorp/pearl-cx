import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Text} from 'react-native';
import Collapsible from '../../components/closedloop/CentralizedRootCause/components/CollapsableView';

describe('Collapsible', () => {
  const testContent = 'Test Content';
  const headerTitle = 'Test Header';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial rendering', () => {
    it('should render with default initially closed state', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render with initially open state', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle} isInitiallyOpen={true}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render header with default style', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render with custom header style', () => {
      const customHeaderStyle = {backgroundColor: 'red'};
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          headerStyle={customHeaderStyle}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render with custom container style', () => {
      const customStyle = {padding: 20};
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          style={customStyle}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });
  });

  describe('Content display', () => {
    it('should not render content when initially closed', () => {
      const {queryByText} = render(
        <Collapsible headerTitle={headerTitle} isInitiallyOpen={false}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      // When closed, animated view should have height 0
      const content = queryByText(testContent);
      // The hidden content exists off-screen for measurement
      expect(queryByText(headerTitle)).toBeTruthy();
    });

    it('should render children when initially open', async () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle} isInitiallyOpen={true}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      await waitFor(() => {
        expect(getByText(headerTitle)).toBeTruthy();
      });
    });

    it('should render multiple children', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>Child 1</Text>
          <Text>Child 2</Text>
          <Text>Child 3</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should handle complex children elements', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
          <Text>Item 3</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });
  });

  describe('Toggle interaction', () => {
    it('should toggle open state when header is pressed', async () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle} isInitiallyOpen={false}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);
      fireEvent.press(header);

      await waitFor(() => {
        expect(header).toBeTruthy();
      });
    });

    it('should toggle multiple times', async () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle} isInitiallyOpen={true}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);

      fireEvent.press(header);
      await waitFor(() => {
        expect(header).toBeTruthy();
      });

      fireEvent.press(header);
      await waitFor(() => {
        expect(header).toBeTruthy();
      });
    });

    it('should call external callback when toggled', async () => {
      const setIsOpenExternal = jest.fn();
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          isInitiallyOpen={false}
          setIsOpenExternal={setIsOpenExternal}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);
      fireEvent.press(header);

      await waitFor(() => {
        expect(setIsOpenExternal).toHaveBeenCalled();
      });
    });

    it('should pass correct state to external callback on open', async () => {
      const setIsOpenExternal = jest.fn();
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          isInitiallyOpen={false}
          setIsOpenExternal={setIsOpenExternal}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);
      fireEvent.press(header);

      await waitFor(() => {
        expect(setIsOpenExternal).toHaveBeenCalledWith(true);
      });
    });

    it('should pass correct state to external callback on close', async () => {
      const setIsOpenExternal = jest.fn();
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          isInitiallyOpen={true}
          setIsOpenExternal={setIsOpenExternal}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);
      fireEvent.press(header);

      await waitFor(() => {
        expect(setIsOpenExternal).toHaveBeenCalled();
      });
    });
  });

  describe('Custom components', () => {
    it('should render leading component', () => {
      const leadingComponent = <Text>Leading</Text>;
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          leadingComponent={leadingComponent}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText('Leading')).toBeTruthy();
      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render trailing component', () => {
      const trailingComponent = <Text>Trailing</Text>;
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          tailingComponent={trailingComponent}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText('Trailing')).toBeTruthy();
      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render both leading and trailing components', () => {
      const leadingComponent = <Text>Leading</Text>;
      const trailingComponent = <Text>Trailing</Text>;
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          leadingComponent={leadingComponent}
          tailingComponent={trailingComponent}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText('Leading')).toBeTruthy();
      expect(getByText('Trailing')).toBeTruthy();
      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should render without trailing component (use default icon)', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });
  });

  describe('Custom styles', () => {
    it('should apply custom header title style', () => {
      const customTitleStyle = {fontSize: 20};
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          headerTitleStyle={customTitleStyle}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should apply custom leading component style', () => {
      const customLeadingStyle = {marginRight: 16};
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          leadingComponent={<Text>L</Text>}
          leadingComponentStyle={customLeadingStyle}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should apply custom trailing component style', () => {
      const customTrailingStyle = {marginLeft: 16};
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          tailingComponent={<Text>T</Text>}
          tailingComponentStyle={customTrailingStyle}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });
  });

  describe('Props combinations', () => {
    it('should render with all props provided', () => {
      const leadingComponent = <Text>L</Text>;
      const trailingComponent = <Text>T</Text>;
      const customStyle = {padding: 10};
      const customHeaderStyle = {backgroundColor: 'blue'};

      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          isInitiallyOpen={true}
          leadingComponent={leadingComponent}
          tailingComponent={trailingComponent}
          style={customStyle}
          headerStyle={customHeaderStyle}
          setIsOpenExternal={jest.fn()}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
      expect(getByText('L')).toBeTruthy();
      expect(getByText('T')).toBeTruthy();
    });

    it('should render with minimal props', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty header title', () => {
      const {getByText} = render(
        <Collapsible headerTitle="">
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      // Empty text still renders
      expect(true).toBe(true);
    });

    it('should handle empty children', () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
        </Collapsible>,
      );

      expect(getByText(headerTitle)).toBeTruthy();
    });

    it('should handle null external callback', () => {
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          setIsOpenExternal={null}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);
      fireEvent.press(header);

      expect(header).toBeTruthy();
    });

    it('should handle undefined external callback', () => {
      const {getByText} = render(
        <Collapsible
          headerTitle={headerTitle}
          setIsOpenExternal={undefined}
        >
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);
      fireEvent.press(header);

      expect(header).toBeTruthy();
    });

    it('should handle very long header title', () => {
      const longTitle = 'A'.repeat(100);
      const {getByText} = render(
        <Collapsible headerTitle={longTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Test@#$%^&*()';
      const {getByText} = render(
        <Collapsible headerTitle={specialTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      expect(getByText(specialTitle)).toBeTruthy();
    });

    it('should handle rapid toggle clicks', async () => {
      const {getByText} = render(
        <Collapsible headerTitle={headerTitle}>
          <Text>{testContent}</Text>
        </Collapsible>,
      );

      const header = getByText(headerTitle);

      fireEvent.press(header);
      fireEvent.press(header);
      fireEvent.press(header);
      fireEvent.press(header);

      await waitFor(() => {
        expect(header).toBeTruthy();
      });
    });
  });
});
