export const isStringNullOrEmpty = string => {
  if (string) {
    return string.trim() == '' || string.trim().length == 0;
  }
  return true;
};
