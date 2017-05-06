export default {
  ccSecret: '1234567890',  // Use to encrypt and decrypt credit card information
  //StripeSecretKey: 'sk_test_xiQN7kQYSgMWSnrrmn40yRHi',  // Viet Stripe secret key
  //StripeSecretKey : 'sk_test_UPYeBtZ0jabqHTdjYrrNJQQr', // Thuan
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
    emailNotExists: 'EMAIL_NOT_EXISTS',
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
    notParent: 'YOU_ARE_NOT_PARENT',
    studentEmailNotFound: 'UNREGISTERED_STUDENT',
    linkCodeNotFound: 'LINK_CODE_NOT_FOUND',
    alreadyLinked: 'ALREADY_LINKED_BEFORE',
    alreadyLinkedToAnotherParent: 'ALREADY_LINKED_TO_ANOTHER_PARENT',
    alreadyIsAnnually: 'ALREADY_IS_ANNUALL',
    cannotUpgrade: 'CANNOT_UPGRADE_SUBSCRIPTION'
  },
  emailTokens: {
    mail_forgot_password: ['{firstName}', '{lastName}', '{email}', '{resetPasswordUrl}'],  // DONE
    mail_reset_password_inform: ['{firstName}', '{lastName}'],
    mail_sign_up_confirmation: ['{firstName}', '{lastName}'],
    mail_bank_transfer_instruction: ['{firstName}', '{lastName}'],
    mail_bank_transfer_activation: ['{firstName}', '{lastName}', '{subscriptionLink}'],
    mail_bank_transfer_cancellation: ['{firstName}', '{lastName}'],
    mail_bank_transfer_reactivate_subscription: ['{firstName}', '{lastName}', '{subject}', '{periodStart}', '{periodEnd}', '{periodPrice}'],
    mail_cancel_monthly_subscription: ['{firstName}', '{lastName}', '{signUpLink}'],
    mail_cancel_annually_subscription: ['{firstName}', '{lastName}', '{signUpLink}'],
    mail_trial_reminder_after_7_days: ['{firstName}', '{lastName}', '{price}', '{type}', '{subscriptionDetailsLink}'],
    mail_trial_reminder_after_12_days: ['{firstName}', '{lastName}', '{price}', '{type}', '{subscriptionDetailsLink}'],
    mail_trial_reminder_after_13_days: ['{firstName}', '{lastName}', '{price}', '{type}', '{subscriptionDetailsLink}'],
    mail_trial_reminder_when_expired: ['{firstName}', '{lastName}', '{price}', '{type}', '{subscriptionDetailsLink}'],
    mail_sorry_for_cancellation: ['{firstName}', '{lastName}', '{signUpLink}'],
    mail_successful_charge: ['{firstName}', '{lastName}', '{price}', '{type}', '{subject}', '{subscriptionDetailsLink}'],
    mail_subscribe_via_bank_transfer: ['{firstName}', '{lastName}', '{email}'],
  }
};
