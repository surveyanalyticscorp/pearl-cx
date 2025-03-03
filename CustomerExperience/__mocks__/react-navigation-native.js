// __mocks__/react-navigation-native.js

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
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  replace: jest.fn(),
  navigate: jest.fn((route, params) => {
    return {
      type: 'PUSH',
      route,
      params,
    };
  }),
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
});

export const useRoute = () => ({
  params: {},
});

export const NavigationContainer = ({children}) => children;

export const useIsFocused = () => true;
export const StackActions = {push: jest.fn()};
export default {
  useNavigation,
  useRoute,
  NavigationContainer,
  useIsFocused,
};
