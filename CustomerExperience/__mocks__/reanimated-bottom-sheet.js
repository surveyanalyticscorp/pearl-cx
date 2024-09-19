export default {
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    snapTo: jest.fn(),
  })),
};
