// Mock for @react-navigation/core
export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

export const useRoute = () => ({
  params: {},
  key: 'test',
  name: 'Test',
});

export const useIsFocused = () => true;

export const useFocusEffect = callback => {
  // Mock implementation - just call the callback
  if (typeof callback === 'function') {
    callback();
  }
};

export const CommonActions = {
  navigate: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
};

export const StackActions = {
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  replace: jest.fn(),
};
