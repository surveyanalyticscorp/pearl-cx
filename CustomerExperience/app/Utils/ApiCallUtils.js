import StringUtils from './StringUtils';

export function getBearerToken(bearerToken) {
  return {Authorization: `Bearer ${bearerToken}`};
}

export function getClfUrl(url) {
  return '' + global.clfBaseUrl + url;
}

export function getBearerTokenStatic() {
  console.log('BEARER TOKEN', global.bearerToken);
  return {Authorization: `Bearer ${global.bearerToken}`};
}
