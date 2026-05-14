export const getApiValidationErrorMessage = (
  errorMessage,
  logIdentifier = 'default',
) => {
  console.log(
    `getApiValidationErrorMessage ${logIdentifier}`,
    JSON.stringify(errorMessage),
  );
  if (errorMessage.errorAlert) {
    return errorMessage?.errorAlert
      ? errorMessage?.errorAlert
      : /* istanbul ignore next */ errorMessage?.validationErrors[0]?.error;
  }

  if (errorMessage.message) {
    if (errorMessage?.message.includes('jwt expired')) {
      return 'Session expired, please login again';
    } else {
      return errorMessage?.message;
    }
  }
  return 'Error';
};
