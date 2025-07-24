import StringUtils from './StringUtils';

export function getBearerToken(bearerToken) {
  return {Authorization: `Bearer ${bearerToken}`};
}

export function getClfUrl(url) {
  const baseUrl = global.clfBaseUrl?.replace(/['"]/g, ''); // Remove any quotes
  return baseUrl + url;
}

export function getBearerTokenStatic() {
  console.log('BEARER TOKEN', global.bearerToken);
  return {Authorization: `Bearer ${global.bearerToken}`};
}
