/* eslint-disable */
const constants = {};

constants.frequency = {
  monthly: 'monthly',
  annually: 'annually',
}

constants.paymentMethod = {
  bankTransfer: 'bank',
  creditCard: 'stripe'
}

constants.subscriptionStatuses = ["pending", "trailing", "active", "overdue", "cancelled"]

constants.emailTokens = {
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
};

export default constants;
