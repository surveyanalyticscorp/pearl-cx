import WebServiceHandler from './WebServiceHandler';

describe('WebServiceHandler', () => {
  const successResponse = {
    statusCode: 200,
    body: {
      data: 'success',
    },
  };
  const errorResponse = {
    statusCode: 400,
    body: {
      error: 'error',
    },
  };
  beforeEach(() => {
    fetch.resetMocks(); // Reset mocks before each test
  });
  // it('should return a promise from GET request', () => {
  //   const result = WebServiceHandler.get('https://example.com/api', {}, {});
  //   expect(result).toBeInstanceOf(Promise);
  // });
  it('should return a promise from GET request', async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const result = await WebServiceHandler.get(
      'https://example.com/api',
      {},
      {},
    );
    expect(result).toBeDefined();
  });

  it('should generate HTTP headers', () => {
    const headerParam = {Authorization: 'Bearer token'};
    const headers = WebServiceHandler.header(headerParam);
    expect(headers.get('Authorization')).toBe('Bearer token');
  });

  it('should generate HTTP headers for form data', () => {
    const headerParam = {Authorization: 'Bearer token'};
    const headers = WebServiceHandler.headerFormData(headerParam);
    expect(headers.get('Authorization')).toBe('Bearer token');
    expect(headers.get('Content-Type')).toBe('multipart/form-data');
  });

  it('should generate HTTP request parameters', () => {
    const parameter = {key: 'value'};
    const urlParameter = WebServiceHandler.parameter(parameter);
    expect(urlParameter).toBe('?key=value');
  });

  it('should make an API call', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const apiMethod = 'GET';
    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const queryParam = {key: 'value'};
    const body = null;

    return WebServiceHandler.makeApiCall(
      apiMethod,
      url,
      headerParam,
      queryParam,
      body,
    ).then(response => {
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
    });
  });
  it('should make a GET request', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response
    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.get(url, headerParam, parameter).then(response => {
      expect(response).toBeDefined();
    });
  });

  it('should make a POST request', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};
    const queryParam = {key: 'value'};

    return WebServiceHandler.postNew(
      url,
      headerParam,
      parameter,
      queryParam,
    ).then(response => {
      expect(response).toBeDefined();
    });
  });

  it('should make a PATCH request', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.patch(url, headerParam, parameter).then(
      response => {
        expect(response).toBeDefined();
      },
    );
  });

  it('should make a POST request to upload a file', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const formData = new FormData();
    const mockFile = new Blob(['file content'], {type: 'text/plain'});
    formData.append('file', mockFile);
    const queryParam = {key: 'value'};

    return WebServiceHandler.postUploadFile(
      url,
      headerParam,
      formData,
      queryParam,
    ).then(response => {
      expect(response).toBeDefined();
    });
  });

  it('should make a DELETE request', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.delete(url, headerParam, parameter).then(
      response => {
        expect(response).toBeDefined();
      },
    );
  });
});
