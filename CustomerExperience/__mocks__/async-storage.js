// __mocks__/async-storage.js
// check this https://github.com/react-native-async-storage/async-storage/blob/master/src/__mocks__/async-storage.js
//check bottom code for  mock

const mockStorage = new Map();

export const useAsyncStorage = jest.fn(key => {
  return {
    getItem: jest.fn(() => Promise.resolve(mockStorage.get(key) || null)),
    setItem: jest.fn(value => {
      mockStorage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn(() => {
      mockStorage.delete(key);
      return Promise.resolve();
    }),
  };
});

export default {
  getItem: jest.fn(key => Promise.resolve(mockStorage.get(key) || null)),
  setItem: jest.fn((key, value) => {
    mockStorage.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn(key => {
    mockStorage.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    return Promise.resolve();
  }),
};
