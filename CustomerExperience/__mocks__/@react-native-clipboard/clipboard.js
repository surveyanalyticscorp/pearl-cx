const Clipboard = {
  getString: jest.fn(() => Promise.resolve('')),
  setString: jest.fn(),
  hasString: jest.fn(() => Promise.resolve(false)),
  getImagePNG: jest.fn(() => Promise.resolve(null)),
  getImageJPG: jest.fn(() => Promise.resolve(null)),
  setImage: jest.fn(),
  getTypes: jest.fn(() => Promise.resolve([])),
  hasURL: jest.fn(() => Promise.resolve(false)),
  hasNumber: jest.fn(() => Promise.resolve(false)),
  hasWebURL: jest.fn(() => Promise.resolve(false)),
  addListener: jest.fn(() => ({remove: jest.fn()})),
  removeAllListeners: jest.fn(),
};

export default Clipboard;
