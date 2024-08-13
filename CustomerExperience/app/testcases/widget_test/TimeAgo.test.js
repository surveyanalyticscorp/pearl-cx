// import React from 'react';
// import {Provider} from 'react-redux';
// import {mount} from 'enzyme';
// import configureStore from 'redux-mock-store';
// import TimeAgo from '../../widgets/TimeAgo';
// import '../../../setupTests';

// it('should render correctly <TimeAgo> component', () => {
//   const mockStore = configureStore();
//   const store = mockStore({});
//   const wrapper = mount(
//     <Provider store={store}>
//       <TimeAgo />
//     </Provider>,
//   );

//   expect(wrapper).toMatchSnapshot();
// });

import React from 'react';
import {Text} from 'react-native';
import {render, act} from '@testing-library/react-native';
import TimeAgo from '../../widgets/TimeAgo';
import moment from 'moment';

// Mock moment.js
jest.mock('moment', () => {
  return jest.fn(() => ({
    fromNow: jest.fn(() => 'a few seconds ago'),
  }));
});

describe('TimeAgo component', () => {
  const originalSetInterval = global.setInterval;
  const originalClearInterval = global.clearInterval;

  beforeEach(() => {
    global.setInterval = jest.fn();
    global.clearInterval = jest.fn();
  });

  afterEach(() => {
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const {getByText} = render(<TimeAgo time={new Date()} />);
    expect(getByText('a few seconds ago')).toBeTruthy();
  });

  it('renders correctly with hideAgo prop', () => {
    const {getByText} = render(<TimeAgo time={new Date()} hideAgo />);
    expect(getByText('a few seconds ago')).toBeTruthy();
  });

  // it('calls setInterval on componentDidMount', () => {
  //   const setIntervalSpy = jest.spyOn(TimeAgo.prototype, 'setInterval');
  //   render(<TimeAgo time={new Date()} interval={10000} />);
  //   expect(setIntervalSpy).toHaveBeenCalledWith(10000);
  //   setIntervalSpy.mockRestore();
  // });

  it('calls clearInterval on componentWillUnmount', () => {
    const clearIntervalSpy = jest.spyOn(TimeAgo.prototype, 'clearInterval');
    const {unmount} = render(<TimeAgo time={new Date()} />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('updates the component on interval', () => {
    jest.useFakeTimers();
    const {getByText} = render(<TimeAgo time={new Date()} interval={1000} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByText('a few seconds ago')).toBeTruthy();
    jest.useRealTimers();
  });

  it('updates time when props change', () => {
    const {getByText, rerender} = render(<TimeAgo time={new Date()} />);
    rerender(<TimeAgo time={new Date(Date.now() - 60000)} />);
    expect(getByText('a few seconds ago')).toBeTruthy();
  });
});
