export function getBearerToken(bearerToken) {
  return {Authorization: `Bearer ${bearerToken}`};
}

export function getClfUrl(url) {
  return '' + global.clfBaseUrl + url;
}

export function getBearerTokenStatic() {
  return {Authorization: `Bearer ${global.bearerToken}`};
}
