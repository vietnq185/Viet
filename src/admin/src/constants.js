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
  mail_forgot_password: ['{firstName}', '{lastName}', '{resetPasswordUrl}']
};

export default constants;
