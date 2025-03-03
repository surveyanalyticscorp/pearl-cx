import {getBearerToken, getClfUrl, getBearerTokenStatic} from './ApiCallUtils'; // Adjust the import path as necessary

describe('Utility Functions', () => {
  describe('getBearerToken', () => {
    it('should return an object with the Authorization header containing the provided bearer token', () => {
      const token = 'test-token';
      const expectedOutput = {Authorization: `Bearer ${token}`};
      expect(getBearerToken(token)).toEqual(expectedOutput);
    });
  });

  describe('getClfUrl', () => {
    beforeAll(() => {
      global.clfBaseUrl = 'https://example.com/';
    });

    it('should return a full URL combining the global clfBaseUrl and the provided url', () => {
      const url = 'path/to/resource';
      const expectedOutput = 'https://example.com/path/to/resource';
      expect(getClfUrl(url)).toBe(expectedOutput);
    });

    it('should return the base URL if an empty url is provided', () => {
      const url = '';
      const expectedOutput = 'https://example.com/';
      expect(getClfUrl(url)).toBe(expectedOutput);
    });

    afterAll(() => {
      delete global.clfBaseUrl;
    });
  });

  describe('getBearerTokenStatic', () => {
    beforeAll(() => {
      global.bearerToken = 'static-test-token';
    });

    it('should return an object with the Authorization header containing the global bearer token', () => {
      const expectedOutput = {Authorization: `Bearer static-test-token`};
      expect(getBearerTokenStatic()).toEqual(expectedOutput);
    });

    afterAll(() => {
      delete global.bearerToken;
    });
  });
});
