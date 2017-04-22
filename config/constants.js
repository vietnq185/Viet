export default {
  ccSecret: '1234567890',  // Use to encrypt and decrypt credit card information
  StripeSecretKey: 'sk_test_xiQN7kQYSgMWSnrrmn40yRHi',  // Stripe secret key
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
    parentNotFound: 'PARENT_NOT_FOUND',
    planNotFound: 'PLAN_NOT_FOUND',
    createSubscriptionError: 'CREATE_SUBSCRIPTION_ERROR',
    subscriptionNotFound: 'SUBSCRIPTION_NOT_FOUND',
    studentNotFound: 'STUDENT_NOT_FOUND',
    cardNotFound: 'CARD_NOT_FOUND',
    subscriptionDoesNotBelongToYou: 'SUBSCRIPTION_DOES_NOT_BELONG_TO_YOU',
    subscriptionPaidSuccessful: 'SUBSCRIPTION_PAID_SUCCESSFUL',
    subscriptionPaidUnSuccessful: 'SUBSCRIPTION_PAID_UNSUCCESSFUL',
    subscriptionUpgradeSuccessful: 'SUBSCRIPTION_UPGRADE_SUCCESSFUL',
    subscriptionUpgradeUnSuccessful: 'SUBSCRIPTION_UPGRADE_UNSUCCESSFUL',
    invalidCard: 'INVALID_CARD',
  },
};
