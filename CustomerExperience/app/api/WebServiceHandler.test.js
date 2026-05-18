// import WebServiceHandler from './WebServiceHandler';

// describe('WebServiceHandler', () => {
//   const successResponse = {
//     statusCode: 200,
//     body: {
//       data: 'success',
//     },
//   };
//   const errorResponse = {
//     statusCode: 400,
//     body: {
//       error: 'error',
//     },
//   };
//   const mock404Response = {
//     status: 404,
//     body: {
//       error: 'Not Found',
//     },
//   };

//   beforeEach(() => {
//     fetch.resetMocks(); // Reset mocks before each test
//   });

//   it('should return a promise from GET request', async () => {
//     fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

//     const result = await WebServiceHandler.get(
//       'https://example.com/api',
//       {},
//       {},
//     );
//     expect(result).toBeDefined();
//   });

//   it('should generate HTTP headers', () => {
//     const headerParam = {Authorization: 'Bearer token'};
//     const headers = WebServiceHandler.header(headerParam);
//     expect(headers.get('Authorization')).toBe('Bearer token');
//     expect(headers.get('Content-Type')).toBe('application/json');
//   });

//   it('should generate HTTP headers for form data', () => {
//     const headerParam = {Authorization: 'Bearer token'};
//     const headers = WebServiceHandler.headerFormData(headerParam);
//     expect(headers.get('Authorization')).toBe('Bearer token');
//     expect(headers.get('Content-Type')).toBe('multipart/form-data');
//   });

//   it('should generate HTTP request parameters', () => {
//     const parameter = {key: 'value'};
//     const urlParameter = WebServiceHandler.parameter(parameter);
//     expect(urlParameter).toBe('?key=value');
//   });

//   it('should handle missing parameters gracefully', () => {
//     const urlParameter = WebServiceHandler.parameter(undefined); // No parameters
//     expect(urlParameter).toBe(''); // Should return an empty string
//   });

//   it('should handle a 404 error in makeApiCall', () => {
//     fetch.mockResponseOnce(JSON.stringify(mock404Response), {status: 404});

//     const apiMethod = 'GET';
//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const queryParam = {key: 'value'};

//     return WebServiceHandler.makeApiCall(
//       apiMethod,
//       url,
//       headerParam,
//       queryParam,
//       null,
//     ).catch(err => {
//       expect(err).toBeDefined();
//     });
//   });

//   it('should handle non-200 response in makeApiCall', () => {
//     fetch.mockResponseOnce(JSON.stringify(errorResponse)); // Mock a non-200 response

//     const apiMethod = 'GET';
//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const queryParam = {key: 'value'};

//     return WebServiceHandler.makeApiCall(
//       apiMethod,
//       url,
//       headerParam,
//       queryParam,
//       null,
//     ).catch(err => {
//       expect(err.statusCode).toBe(400);
//     });
//   });

//   it('should make a GET request', () => {
//     fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response
//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const parameter = {key: 'value'};

//     return WebServiceHandler.get(url, headerParam, parameter).then(response => {
//       expect(response).toBeDefined();
//     });
//   });

//   it('should make a POST request', () => {
//     fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const parameter = {key: 'value'};
//     const queryParam = {key: 'value'};

//     return WebServiceHandler.postNew(
//       url,
//       headerParam,
//       parameter,
//       queryParam,
//     ).then(response => {
//       expect(response).toBeDefined();
//     });
//   });

//   it('should make a PATCH request', () => {
//     fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const parameter = {key: 'value'};

//     return WebServiceHandler.patch(url, headerParam, parameter).then(
//       response => {
//         expect(response).toBeDefined();
//       },
//     );
//   });

//   it('should make a POST request to upload a file', () => {
//     fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const formData = new FormData();
//     const mockFile = new Blob(['file content'], {type: 'text/plain'});
//     formData.append('file', mockFile);
//     const queryParam = {key: 'value'};

//     return WebServiceHandler.postUploadFile(
//       url,
//       headerParam,
//       formData,
//       queryParam,
//     ).then(response => {
//       expect(response).toBeDefined();
//     });
//   });

//   it('should make a DELETE request', () => {
//     fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const parameter = {key: 'value'};

//     return WebServiceHandler.delete(url, headerParam, parameter).then(
//       response => {
//         expect(response).toBeDefined();
//       },
//     );
//   });

//   it('should handle API errors in postUploadFile', () => {
//     fetch.mockResponseOnce(JSON.stringify(errorResponse), {status: 400});

//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const formData = new FormData();
//     const mockFile = new Blob(['file content'], {type: 'text/plain'});
//     formData.append('file', mockFile);
//     const queryParam = {key: 'value'};

//     return WebServiceHandler.postUploadFile(
//       url,
//       headerParam,
//       formData,
//       queryParam,
//     ).catch(err => {
//       expect(err.statusCode).toBe(400);
//     });
//   });

//   it('should handle fetch errors', () => {
//     fetch.mockRejectOnce(new Error('Network error')); // Simulate a network error

//     const url = 'https://example.com/api';
//     const headerParam = {Authorization: 'Bearer token'};
//     const parameter = {key: 'value'};

//     return WebServiceHandler.get(url, headerParam, parameter).catch(err => {
//       expect(err.message).toBe('Network error');
//     });
//   });
// });

import WebServiceHandler from './WebServiceHandler';
import {SUCCESS} from './Constant';

// create a global baseUrl variable

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
  const mock404Response = {
    status: 404,
    body: {
      error: 'Not Found',
    },
  };

  beforeEach(() => {
    fetch.resetMocks(); // Reset mocks before each test
    global.baseUrl = 'https://global.api.com/'; // Mock the global baseUrl
  });

  it('should return a promise from GET request', async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const result = await WebServiceHandler.get(
      'https://example.com/api',
      {},
      {},
    );
    expect(result).toBeDefined();
  });

  it('should use global baseUrl when URL is relative in GET request', async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const result = await WebServiceHandler.get('endpoint', {}, {}); // Relative URL
    expect(fetch).toHaveBeenCalledWith(
      `${global.baseUrl}endpoint?`,
      expect.anything(),
    );
    expect(result).toBeDefined();
  });

  it('should generate HTTP headers', () => {
    const headerParam = {Authorization: 'Bearer token'};
    const headers = WebServiceHandler.header(headerParam);
    expect(headers.get('Authorization')).toBe('Bearer token');
    expect(headers.get('Content-Type')).toBe('application/json');
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

  it('should handle missing parameters gracefully', () => {
    const urlParameter = WebServiceHandler.parameter(undefined); // No parameters
    expect(urlParameter).toBe(''); // Should return an empty string
  });

  it('should handle a 404 error in makeApiCall and call failed(response)', () => {
    fetch.mockResponseOnce(JSON.stringify(mock404Response), {status: 404});

    const apiMethod = 'GET';
    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const queryParam = {key: 'value'};

    return WebServiceHandler.makeApiCall(
      apiMethod,
      url,
      headerParam,
      queryParam,
      null,
    ).catch(err => {
      expect(err.status).toBe(404); // Ensure the error is caught
    });
  });

  it('should call failed(response) when the response is not successful', () => {
    fetch.mockResponseOnce(JSON.stringify(errorResponse), {status: 400}); // Mock a 400 response

    const apiMethod = 'GET';
    const url = 'https://example.com/api';
    const headerParam = {Authorization: 'Bearer token'};
    const queryParam = {key: 'value'};

    return WebServiceHandler.makeApiCall(
      apiMethod,
      url,
      headerParam,
      queryParam,
      null,
    ).catch(err => {
      expect(err.statusCode).toBe(400);
      expect(err.body.error).toBe('error');
    });
  });

  it('should make a GET request using global baseUrl', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response
    const url = 'api'; // Relative URL
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.get(url, headerParam, parameter).then(response => {
      expect(fetch).toHaveBeenCalledWith(
        `${global.baseUrl}api?key=value`,
        expect.anything(),
      );
      expect(response).toBeDefined();
    });
  });

  it('should make a POST request using global baseUrl', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'api'; // Relative URL
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};
    const queryParam = {key: 'value'};

    return WebServiceHandler.postNew(
      url,
      headerParam,
      parameter,
      queryParam,
    ).then(response => {
      expect(fetch).toHaveBeenCalledWith(
        `${global.baseUrl}api?key=value`,
        expect.anything(),
      );
      expect(response).toBeDefined();
    });
  });

  it('should make a PATCH request using global baseUrl', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'api'; // Relative URL
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.patch(url, headerParam, parameter).then(
      response => {
        expect(fetch).toHaveBeenCalledWith(
          `${global.baseUrl}api`,
          expect.anything(),
        );
        expect(response).toBeDefined();
      },
    );
  });

  it('should make a POST request to upload a file using global baseUrl', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'api'; // Relative URL
    const headerParam = {Authorization: 'Bearer token'};
    const formData = new FormData();
    const mockFile = new Blob(['file content'], {type: 'text/plain'}); // Create a mock file
    formData.append('file', mockFile);
    const queryParam = {key: 'value'};

    return WebServiceHandler.postUploadFile(
      url,
      headerParam,
      formData,
      queryParam,
    ).then(response => {
      expect(fetch).toHaveBeenCalledWith(
        `${global.baseUrl}api?key=value`,
        expect.anything(),
      );
      expect(response).toBeDefined();
    });
  });

  it('should make a DELETE request using global baseUrl', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse)); // Mock the fetch response

    const url = 'api'; // Relative URL
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.delete(url, headerParam, parameter).then(
      response => {
        expect(fetch).toHaveBeenCalledWith(
          `${global.baseUrl}api`,
          expect.anything(),
        );
        expect(response).toBeDefined();
      },
    );
  });

  it('should handle fetch errors in delete method', () => {
    fetch.mockRejectOnce(new Error('Network error')); // Simulate a network error

    const url = 'api'; // Relative URL
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    return WebServiceHandler.delete(url, headerParam, parameter).catch(err => {
      expect(err.message).toBe('Network error');
    });
  });

  it('should handle API errors in postUploadFile', () => {
    fetch.mockResponseOnce(JSON.stringify(errorResponse), {status: 400});

    const url = 'api'; // Relative URL
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
    ).catch(err => {
      expect(err.statusCode).toBe(400);
    });
  });

  it('should handle null headers in makeApiCall', async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse));

    const apiMethod = 'GET';
    const url = 'https://example.com/api';
    const headerParam = null;
    const queryParam = {};

    const result = await WebServiceHandler.makeApiCall(
      apiMethod,
      url,
      headerParam,
      queryParam,
      null,
    );
    expect(result).toBeDefined();
    expect(fetch).toHaveBeenCalledWith(
      url + '?',
      expect.objectContaining({headers: {}}),
    );
  });

  it('should handle success response with status field (not statusCode)', async () => {
    const responseWithStatus = {status: 'SUCCESS', data: 'success'};
    fetch.mockResponseOnce(JSON.stringify(responseWithStatus));

    const url = 'api';
    const headerParam = {Authorization: 'Bearer token'};
    const queryParam = {};

    const result = await WebServiceHandler.makeApiCall(
      'GET',
      url,
      headerParam,
      queryParam,
      null,
    );
    expect(result).toBeDefined();
  });

  it('should handle error response where error field is null', async () => {
    const responseWithNullError = {statusCode: 400, error: null};
    fetch.mockResponseOnce(JSON.stringify(responseWithNullError));

    const url = 'api';
    const result = await WebServiceHandler.makeApiCall(
      'GET',
      url,
      {},
      {},
      null,
    );
    expect(result).toBeDefined();
  });

  it('should handle patch method fetch errors silently', async () => {
    fetch.mockRejectOnce(new Error('Patch error'));

    const url = 'api';
    const headerParam = {Authorization: 'Bearer token'};
    const parameter = {key: 'value'};

    const result = WebServiceHandler.patch(url, headerParam, parameter);
    expect(result).toBeInstanceOf(Promise);
    // The patch method does not reject on error, so we just verify it returns a promise
  });

  it('should handle postUploadFile without queryParam', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse));

    const url = 'api';
    const headerParam = {Authorization: 'Bearer token'};
    const formData = new FormData();
    const mockFile = new Blob(['test'], {type: 'text/plain'});
    formData.append('file', mockFile);

    return WebServiceHandler.postUploadFile(
      url,
      headerParam,
      formData,
      null,
    ).then(response => {
      expect(fetch).toHaveBeenCalledWith(
        `${global.baseUrl}api`,
        expect.anything(),
      );
      expect(response).toBeDefined();
    });
  });

  it('should handle multiple query parameters in parameter method', () => {
    const parameter = {
      status: 'active',
      priority: 'high',
      page: '1',
      sortBy: 'date',
    };
    const result = WebServiceHandler.parameter(parameter);
    expect(result).toContain('status=active');
    expect(result).toContain('priority=high');
    expect(result).toContain('page=1');
    expect(result).toContain('sortBy=date');
  });

  it('should URL encode special characters in parameter values', () => {
    const parameter = {search: 'hello world & special@chars'};
    const result = WebServiceHandler.parameter(parameter);
    expect(result).toContain('hello%20world');
    expect(result).toContain('%26');
    expect(result).toContain('%40');
  });

  it('should use full URL without prepending baseUrl when URL contains http', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse));

    const fullUrl = 'https://external.api.com/endpoint';
    const headerParam = {};
    const parameter = {};

    return WebServiceHandler.get(fullUrl, headerParam, parameter).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        fullUrl + '?',
        expect.anything(),
      );
    });
  });

  it('should use full URL in POST request when URL contains http', () => {
    fetch.mockResponseOnce(JSON.stringify(successResponse));

    const fullUrl = 'https://external.api.com/endpoint';
    const headerParam = {};
    const parameter = {test: 'data'};

    return WebServiceHandler.postNew(fullUrl, headerParam, parameter, {}).then(
      () => {
        expect(fetch).toHaveBeenCalledWith(
          fullUrl + '?',
          expect.anything(),
        );
      },
    );
  });
});
