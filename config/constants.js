export default {
  ccSecret: '1234567890',  // Use to encrypt and decrypt credit card information
  auth: {
    accessTokenOpts: {
      expiresIn: 24 * 60 * 60, // in seconds, after this time, user MUST login again
    },
    refreshTokenOpts: {
      expiresIn: 24 * 60 * 60, // in seconds
    },
  },
  errors: {
    emailRegisted: 'REGISTERED_EMAIL',
    usernameRegisted: 'REGISTERED_USER',
    wrongUsername: 'UNREGISTERED_USER',
    wrongPassword: 'WRONG_PASSWORD',
    unauthorized: 'UNAUTHORIZED',
    logoutError: 'LOGOUT_ERROR',
    registerError: 'REGISTER_ERROR',
  },
};
