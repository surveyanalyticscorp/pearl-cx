import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {DeleteView} from './DeleteView';
import {useNavigation} from '@react-navigation/native';
import useDeleteAlert from '../hooks/useDeleteAlert';

// Mock the hooks and dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../hooks/useDeleteAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockStore = configureStore([]);

describe('DeleteView', () => {
  let store;
  const mockGoBack = jest.fn();
  const mockSetDeleteAlertVisibility = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({goBack: mockGoBack});
    useDeleteAlert.mockReturnValue([mockSetDeleteAlertVisibility]);

    // Initialize store with default state
    store = mockStore({
      dashboard: {
        ticketDeleteStatus: {
          status: '',
        },
      },
      global: {
        globalSettings: {
          managerDeletePermission: false,
        },
      },
    });
  });

  const renderWithStore = component => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('should render delete button when user has permission', () => {
    // Arrange
    store = mockStore({
      dashboard: {
        ticketDeleteStatus: {
          status: '',
        },
      },
      global: {
        globalSettings: {
          managerDeletePermission: true,
        },
      },
    });

    // Act
    const {getByTestId} = renderWithStore(<DeleteView />);

    // Assert
    const deleteButton = getByTestId('DeleteButtonAction');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.props.testID).toBe('DeleteButtonAction');
  });

  it('should render empty View when user has no permission', () => {
    // Arrange - using default store state (managerDeletePermission: false)

    // Act
    const {root} = renderWithStore(<DeleteView />);

    // Assert
    expect(root.type).toBe('View');
  });

  it('should call setDeleteAlertVisibility when delete button is pressed', () => {
    // Arrange
    store = mockStore({
      dashboard: {
        ticketDeleteStatus: {
          status: '',
        },
      },
      global: {
        globalSettings: {
          managerDeletePermission: true,
        },
      },
    });

    // Act
    const {getByTestId} = renderWithStore(<DeleteView />);
    const deleteButton = getByTestId('DeleteButtonAction');
    fireEvent.press(deleteButton);

    // Assert
    expect(mockSetDeleteAlertVisibility).toHaveBeenCalledWith(true);
  });

  it('should navigate back when ticket delete status is success', () => {
    // Arrange
    store = mockStore({
      dashboard: {
        ticketDeleteStatus: {
          status: 'success',
        },
      },
      global: {
        globalSettings: {
          managerDeletePermission: true,
        },
      },
    });

    // Act
    renderWithStore(<DeleteView />);

    // Assert
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should not navigate back when ticket delete status is not success', () => {
    // Arrange
    store = mockStore({
      dashboard: {
        ticketDeleteStatus: {
          status: 'failed',
        },
      },
      global: {
        globalSettings: {
          managerDeletePermission: true,
        },
      },
    });

    // Act
    renderWithStore(<DeleteView />);

    // Assert
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('should not navigate back when ticket delete status is empty', () => {
    // Arrange - using default store state (status: '')

    // Act
    renderWithStore(<DeleteView />);

    // Assert
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
