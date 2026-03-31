// __mocks__/rn-fetch-blob.js
export default {
  DocumentDir: () => {},
  // Mock any methods or properties that your app uses
  fetch: jest.fn(() => Promise.resolve({data: 'mocked data'})),
  config: jest.fn(() => ({
    fetch: jest.fn(() => Promise.resolve({data: 'mocked data'})),
  })),
};
