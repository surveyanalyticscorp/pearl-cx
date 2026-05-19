import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectStatus from '../../components/closedloop/takeaction/SelectStatus';

describe('SelectStatus', () => {
  const mockStatusData = [
    {id: 0, name: 'New', title: 'New'},
    {id: 1, name: 'In Progress', title: 'In Progress'},
    {id: 2, name: 'Resolved', title: 'Resolved'},
    {id: 3, name: 'Closed', title: 'Closed'},
  ];

  const mockHandleOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getButtonTitle variations', () => {
    it('should render "Set status" for CreateTicket screen', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="CreateTicket"
        />,
      );

      expect(getByText('Set status')).toBeTruthy();
    });

    it('should render "Apply" for Dashboard screen', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="Dashboard"
        />,
      );

      expect(getByText('Apply')).toBeTruthy();
    });

    it('should render "Update status" for other screens', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      expect(getByText('Update status')).toBeTruthy();
    });

    it('should render "Update status" for unknown screen', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="UnknownScreen"
        />,
      );

      expect(getByText('Update status')).toBeTruthy();
    });
  });

  describe('Rendering FlatList with data', () => {
    it('should render all status items in the FlatList', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      mockStatusData.forEach(status => {
        expect(getByText(status.name)).toBeTruthy();
      });
    });

    it('should render with initial selected index', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={2}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      expect(getByText('Resolved')).toBeTruthy();
    });

    it('should render with index 0 as initial selection', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      expect(getByText('New')).toBeTruthy();
    });
  });

  describe('Selection and state changes', () => {
    it('should call handleOnPress with selected item when button is pressed', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      const button = getByText('Update status');
      fireEvent.press(button);

      expect(mockHandleOnPress).toHaveBeenCalledWith(mockStatusData[0], 0);
    });

    it('should render StatusItems with correct data', () => {
      const {getByTestId, getAllByTestId} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      const statusItems = getAllByTestId('status-item-button');
      expect(statusItems.length).toBe(mockStatusData.length);
    });

    it('should call handleOnPress with correct selected item', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={1}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      const button = getByText('Update status');
      fireEvent.press(button);

      expect(mockHandleOnPress).toHaveBeenCalledWith(mockStatusData[1], 1);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty data array', () => {
      const {getByText} = render(
        <SelectStatus
          data={[]}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      expect(getByText('Update status')).toBeTruthy();
    });

    it('should handle single item data', () => {
      const singleData = [{id: 0, name: 'Only', title: 'Only Status'}];
      const {getByText, getAllByTestId} = render(
        <SelectStatus
          data={singleData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      const statusItems = getAllByTestId('status-item-button');
      expect(statusItems.length).toBe(1);
      expect(getByText('Update status')).toBeTruthy();
    });

    it('should handle large dataset', () => {
      const largeData = Array.from({length: 20}, (_, i) => ({
        id: i,
        name: `Status ${i}`,
        title: `Status ${i}`,
      }));

      const {getByText, queryAllByTestId} = render(
        <SelectStatus
          data={largeData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      // FlatList virtualizes, so only visible items render
      const statusItems = queryAllByTestId('status-item-button');
      expect(statusItems.length > 0).toBe(true);
      expect(getByText('Update status')).toBeTruthy();
    });
  });

  describe('Button text variations with different screen names', () => {
    it('should render correct button title for CreateTicket', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="CreateTicket"
        />,
      );

      fireEvent.press(getByText('Set status'));
      expect(mockHandleOnPress).toHaveBeenCalled();
    });

    it('should render correct button title for Dashboard', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="Dashboard"
        />,
      );

      fireEvent.press(getByText('Apply'));
      expect(mockHandleOnPress).toHaveBeenCalled();
    });

    it('should render correct button title for default case', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={0}
          handleOnPress={mockHandleOnPress}
          screenName="SomeOtherScreen"
        />,
      );

      fireEvent.press(getByText('Update status'));
      expect(mockHandleOnPress).toHaveBeenCalled();
    });
  });

  describe('Selected index behavior', () => {
    it('should initialize with correct selectedIndex', () => {
      mockHandleOnPress.mockClear();
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={2}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      fireEvent.press(getByText('Update status'));
      expect(mockHandleOnPress).toHaveBeenCalledWith(mockStatusData[2], 2);
    });

    it('should handle selectedIndex at boundaries', () => {
      const {getByText} = render(
        <SelectStatus
          data={mockStatusData}
          selectedIndex={mockStatusData.length - 1}
          handleOnPress={mockHandleOnPress}
          screenName="TicketDetails"
        />,
      );

      expect(getByText('Closed')).toBeTruthy();
      fireEvent.press(getByText('Update status'));
      expect(mockHandleOnPress).toHaveBeenCalledWith(
        mockStatusData[3],
        3,
      );
    });
  });
});
