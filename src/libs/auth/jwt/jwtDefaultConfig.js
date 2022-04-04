export default {
  // Endpoints
  loginEndpoint: "/Auth/login",
  registerEndpoint: "/Auth/register",
  refreshEndpoint: "/Auth/refresh-token",
  logoutEndpoint: "/Auth/logout",

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",
};
