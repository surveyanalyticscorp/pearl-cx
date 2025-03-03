// __mocks__/@react-navigation/native.js
export const mockNavigate = jest.fn();
export const mockDispatch = jest.fn();
export const useRoute = () => ({
  params: {},
});

export const NavigationContainer = ({children}) => children;

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
};

// useNavigation: () => (),

export const useNavigation = () => ({
  navigate: mockNavigate,
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  replace: jest.fn(),
  // navigate: jest.fn((route, params) => {
  //   return {
  //     type: 'PUSH',
  //     route,
  //     params,
  //   };
  // }),
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
});

export const useIsFocused = () => true;
// export const StackActions = {push: jest.fn()};
export const StackActions = {
  push: jest.fn(routeName => ({type: 'PUSH', routeName})),
};

// see ResponsesButton.test.js for an example of how to use this
// see MarketingButton.test.js for an example of how to use this
