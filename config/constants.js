export default {
  auth: {
    accessTokenOpts: {
      expiresIn: 30 * 60, // in seconds, after this time, user MUST login again
    },
    refreshTokenOpts: {
      expiresIn: 3 * 60 * 60, // in seconds, after this time, user MUST login again
    },
  },
  errors: {
    emailRegisted: 'REGISTERED_EMAIL',
    usernameRegisted: 'REGISTERED_USER',
    wrongUsername: 'UNREGISTERED_USER',
    wrongPassword: 'WRONG_PASSWORD',
    unauthorized: 'UNAUTHORIZED',
  },
};
