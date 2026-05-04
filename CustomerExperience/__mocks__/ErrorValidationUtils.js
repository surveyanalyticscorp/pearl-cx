// Mock for ErrorValidationUtils
export const getApiValidationErrorMessage = jest.fn((errorMessage, type) => {
  if (errorMessage === 'Invalid email/password combination.') {
    return 'Invalid email/password combination.';
  }
  return errorMessage || 'An error occurred';
});

export const validateApiError = jest.fn(error => {
  return error?.message || 'Unknown error';
});
