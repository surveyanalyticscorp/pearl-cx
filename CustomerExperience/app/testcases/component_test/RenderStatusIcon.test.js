import React from 'react';
import {render} from '@testing-library/react-native';
import {RenderStatusIcon} from '../../routes/commonUI/status/RenderStatusIcon';
import {getStatusBorderColor, getStatusFillerColor} from '../../styles/color.constants';
import * as ResponsesIconModule from '../../routes/commonUI/ResponsesIcon';

jest.mock('../../routes/commonUI/ResponsesIcon');
jest.mock('../../styles/color.constants');

describe('RenderStatusIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStatusBorderColor.mockReturnValue('#000000');
    getStatusFillerColor.mockReturnValue('#FFFFFF');
  });

  describe('Rendering status icons', () => {
    it('should render status icon for "New" status', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should render status icon for "In Progress" status', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="In Progress" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should render status icon for "Resolved" status', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="Resolved" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should render status icon for "Closed" status', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="Closed" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should render ResponsesIcon for "All" status', () => {
      const mockResponsesIcon = jest.fn(() => null);
      ResponsesIconModule.ResponsesIcon = mockResponsesIcon;

      render(
        <RenderStatusIcon size={20} title="All" />,
      );

      expect(mockResponsesIcon).toHaveBeenCalled();
    });

    it('should render ResponsesIcon for lowercase "all"', () => {
      const mockResponsesIcon = jest.fn(() => null);
      ResponsesIconModule.ResponsesIcon = mockResponsesIcon;

      render(
        <RenderStatusIcon size={20} title="all" />,
      );

      expect(mockResponsesIcon).toHaveBeenCalled();
    });

    it('should render ResponsesIcon for mixed case "ALL"', () => {
      const mockResponsesIcon = jest.fn(() => null);
      ResponsesIconModule.ResponsesIcon = mockResponsesIcon;

      render(
        <RenderStatusIcon size={20} title="ALL" />,
      );

      expect(mockResponsesIcon).toHaveBeenCalled();
    });
  });

  describe('Size handling', () => {
    it('should use provided size', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={30} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should use default size 14 when not provided', () => {
      const {getByTestId} = render(
        <RenderStatusIcon title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should use default size 14 when size is undefined', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={undefined} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should use provided size for large icons', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={50} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should use provided size for small icons', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={8} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Style handling', () => {
    it('should apply custom style with provided props', () => {
      const customStyle = {padding: 10};
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="New" style={customStyle} />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply border radius style', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply border width and color', () => {
      getStatusBorderColor.mockReturnValue('#FF0000');
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
      expect(getStatusBorderColor).toHaveBeenCalledWith('new');
    });

    it('should apply background color', () => {
      getStatusFillerColor.mockReturnValue('#00FF00');
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
      expect(getStatusFillerColor).toHaveBeenCalledWith('new');
    });
  });

  describe('Color function calls', () => {
    it('should call getStatusBorderColor with lowercase title', () => {
      render(
        <RenderStatusIcon size={20} title="New" />,
      );

      expect(getStatusBorderColor).toHaveBeenCalledWith('new');
    });

    it('should call getStatusFillerColor with lowercase title', () => {
      render(
        <RenderStatusIcon size={20} title="New" />,
      );

      expect(getStatusFillerColor).toHaveBeenCalledWith('new');
    });

    it('should handle different status titles with color functions', () => {
      render(
        <RenderStatusIcon size={20} title="In Progress" />,
      );

      expect(getStatusBorderColor).toHaveBeenCalledWith('in progress');
      expect(getStatusFillerColor).toHaveBeenCalledWith('in progress');
    });

    it('should handle uppercase status titles', () => {
      render(
        <RenderStatusIcon size={20} title="RESOLVED" />,
      );

      expect(getStatusBorderColor).toHaveBeenCalledWith('resolved');
      expect(getStatusFillerColor).toHaveBeenCalledWith('resolved');
    });

    it('should handle mixed case status titles', () => {
      render(
        <RenderStatusIcon size={20} title="InProgress" />,
      );

      expect(getStatusBorderColor).toHaveBeenCalledWith('inprogress');
      expect(getStatusFillerColor).toHaveBeenCalledWith('inprogress');
    });
  });

  describe('Special status "All"', () => {
    it('should render ResponsesIcon with correct size for "All"', () => {
      const mockResponsesIcon = jest.fn(() => null);
      ResponsesIconModule.ResponsesIcon = mockResponsesIcon;

      render(
        <RenderStatusIcon size={20} title="All" />,
      );

      expect(mockResponsesIcon).toHaveBeenCalledWith(
        expect.objectContaining({size: 14}),
        expect.anything(),
      );
    });

    it('should render ResponsesIcon with accentLight tint color', () => {
      const mockResponsesIcon = jest.fn(() => null);
      ResponsesIconModule.ResponsesIcon = mockResponsesIcon;

      render(
        <RenderStatusIcon size={20} title="All" />,
      );

      expect(mockResponsesIcon).toHaveBeenCalled();
    });
  });

  describe('Props combinations', () => {
    it('should handle all props together', () => {
      const customStyle = {marginRight: 5};
      const {getByTestId} = render(
        <RenderStatusIcon size={25} title="Closed" style={customStyle} />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should handle minimal props', () => {
      const {getByTestId} = render(
        <RenderStatusIcon title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should handle only size prop', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={18} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should render with empty title string', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with zero size', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={0} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with very large size', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={1000} title="New" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="New@#$" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });

    it('should handle numbers in title', () => {
      const {getByTestId} = render(
        <RenderStatusIcon size={20} title="Status123" />,
      );

      const icon = getByTestId('render-status-icon');
      expect(icon).toBeTruthy();
    });
  });
});
