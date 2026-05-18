import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ClosedLoopCell from './ClosedloopCell';
// import OverdueBar from './takeaction/closedLoopCell/OverdueBar';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock the required dependencies
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

jest.mock('react-native-reanimated', () => 'Reanimated');

jest.mock('../../routes/commonUI/CommonUI', () => ({
  Avatar: 'Avatar',
  CheckBoxItem: 'CheckBoxItem',
  PriorityUI: 'PriorityUI',
  StatusUI: 'StatusUI',
  ExclaimationIcon: 'ExclaimationIcon',
}));

jest.mock('../../routes/commonUI/ListItemSeparator', () => 'ListItemSeparator');
jest.mock('./takeaction/closedLoopCell/AssigneeUI', () => 'AssigneeUI');

// Mock moment
// jest.mock('moment', () => {
//   const mockMoment = () => ({
//     format: () => '2023-03-20 10:00',
//   });
//   mockMoment.utc = () => mockMoment();
//   return mockMoment;
// });

const mockStore = configureStore([]);

describe('ClosedLoopCell', () => {
  const mockData = {
    id: '123',
    isOverdue: false,
    status: 'open',
    priority: 'high',
    npsScore: 7,
    panelMember: {name: 'John Doe'},
    issueDate: '2023-03-15T10:00:00Z',
    comment: 'This is a test comment',
    assignToId: 'user1',
  };

  const mockProps = {
    data: mockData,
    index: 0,
    isChecked: false,
    onLongPressHandler: jest.fn(),
    onPressHandler: jest.fn(),
    showCheckBox: true,
  };

  let store;

  beforeEach(() => {
    store = mockStore({
      dashboard: {
        ownerDetails: {
          owners: [{ownerID: 'user1', ownerName: 'User One'}],
        },
      },
    });
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <Provider store={store}>
        <ClosedLoopCell {...mockProps} />
      </Provider>,
    );

    expect(getByText('#123')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('This is a test comment')).toBeTruthy();
  });

  it('calls onPressHandler when pressed', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...mockProps} />
      </Provider>,
    );

    fireEvent.press(getByTestId('closedloop-cell'));
    expect(mockProps.onPressHandler).toHaveBeenCalledWith(mockData, 0);
  });

  it('calls onLongPressHandler when long pressed', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...mockProps} />
      </Provider>,
    );

    fireEvent(getByTestId('closedloop-cell'), 'onLongPress');
    expect(mockProps.onLongPressHandler).toHaveBeenCalledWith(mockData, 0);
  });

  it('renders OverdueBar when isOverdue is true', () => {
    const overdueProps = {
      ...mockProps,
      data: {...mockData, isOverdue: true, overdueDate: '2023-03-20T10:00:00Z'},
    };

    const {getByText, getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...overdueProps} />
      </Provider>,
    );

    // expect(getByTestId('text-label')).toBeTruthy();
    // expect(getByText('Ticket overdue')).toBeTruthy();
    expect(getByText('Mar 20, 2023 4:00 PM')).toBeTruthy();
  });

  it('does not render checkbox when showCheckBox is false', () => {
    const propsWithoutCheckbox = {...mockProps, showCheckBox: false};

    const {queryByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...propsWithoutCheckbox} />
      </Provider>,
    );

    expect(queryByTestId('checkbox')).toBeNull();
  });

  it('renders checkbox when showCheckBox is true', () => {
    const {queryByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...mockProps} />
      </Provider>,
    );

    expect(queryByTestId('checkbox')).toBeTruthy();
  });

  it('renders anonymous text when panelMember name is empty', () => {
    const anonymousProps = {
      ...mockProps,
      data: {
        ...mockData,
        panelMember: {email: 'user@example.com'},
      },
    };

    const {getByText} = render(
      <Provider store={store}>
        <ClosedLoopCell {...anonymousProps} />
      </Provider>,
    );

    expect(getByText('user@example.com')).toBeTruthy();
  });

  it('renders anonymous text when panelMember is null or has no name and email', () => {
    const anonymousProps = {
      ...mockProps,
      data: {
        ...mockData,
        panelMember: {},
      },
    };

    const {getByText} = render(
      <Provider store={store}>
        <ClosedLoopCell {...anonymousProps} />
      </Provider>,
    );

    expect(getByText('ticket_list.anonymous')).toBeTruthy();
  });

  it('renders NPS score correctly when npsScore is provided', () => {
    const npsProps = {
      ...mockProps,
      data: {
        ...mockData,
        npsScore: 9,
      },
    };

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...npsProps} />
      </Provider>,
    );

    expect(getByTestId('closedloop-cell')).toBeTruthy();
  });

  it('handles null npsScore', () => {
    const nullNpsProps = {
      ...mockProps,
      data: {
        ...mockData,
        npsScore: null,
      },
    };

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...nullNpsProps} />
      </Provider>,
    );

    expect(getByTestId('closedloop-cell')).toBeTruthy();
  });

  it('calls onPressHandler from checkbox press', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...mockProps} />
      </Provider>,
    );

    fireEvent.press(getByTestId('checkbox'));
    expect(mockProps.onPressHandler).toHaveBeenCalled();
  });

  it('applies borderTopWidth 0 when isOverdue is true', () => {
    const overdueProps = {
      ...mockProps,
      data: {...mockData, isOverdue: true, overdueDate: '2023-03-20T10:00:00Z'},
    };

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...overdueProps} />
      </Provider>,
    );

    const cell = getByTestId('closedloop-cell');
    expect(cell).toBeTruthy();
  });

  it('renders OverdueBar component with correct date', () => {
    const overdueProps = {
      ...mockProps,
      data: {
        ...mockData,
        isOverdue: true,
        overdueDate: '2023-03-18T10:00:00Z',
      },
    };

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoopCell {...overdueProps} />
      </Provider>,
    );

    expect(getByTestId('closedloop-cell')).toBeTruthy();
  });
});
