export function getBearerToken(bearerToken) {
  return {Authorization: `Bearer ${bearerToken}`};
}
