--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.2

-- Started on 2017-05-11 01:35:30 ICT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 3435 (class 0 OID 4866575)
-- Dependencies: 534
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: 
--

INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_sign_up_confirmation_ARRAY_message', 2, '<p>Dear {firstName} {lastName},<br /><br />Welcome to Academic Smart Learning System (A-SLS)!<br /><br />Thanks for signing up with us. You have already created a parent account on A-SLS successfully.<br /><br />If you have any question, please contact us via support@a-smartlearning.com or 1234567890.<br /><br />Sincerely,<br /><br />The A-SLS Team</p>', NULL, 'Sign up confirmation email message', 'text', 15, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_instruction_ARRAY_subject', 2, 'Bank transfer instruction email subject', NULL, 'Bank transfer instruction email subject', 'string', 16, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_instruction_ARRAY_message', 2, '<p>Bank transfer instruction email message</p>', NULL, 'Bank transfer instruction email message', 'text', 17, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_cancellation_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>We are sorry to inform that your subscription has been canceled because we have not received payment for your plan.</p>
<p>Please contact us via +65 1234 4321 or support@a-smartlearning.com to reactivate your subscription.</p>
<p>&nbsp;</p>
<p>Thank you</p>
<p>Sincerely,<br />The A-SLS team.</p>', NULL, 'Bank transfer cancelation email message', 'text', 21, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_reactivate_subscription_ARRAY_subject', 2, 'A-SLS_Reactivate subscription', NULL, 'Bank transfer reactivate subscription email subject', 'string', 22, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_reactivate_subscription_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Thank you for your faith in our service and continuing using it for your child.</p>
<p>Your subscription has been reactivated for annual plan:</p>
<p>- Subject: {subject}<br />- Plan: Annual<br />- Period:&nbsp;{periodStart} - {periodEnd}<br />- Price:&nbsp;{periodPrice}</p>
<p>Please contact us via [Phone Number] or support@a-smartlearning.com to for any kind support.</p>
<p>Thank you</p>', NULL, 'Bank transfer reactivate subscription email message', 'text', 23, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_after_12_days_ARRAY_subject', 2, 'A-SLS_Reminder for 2 days of trial period expires', NULL, 'Trial reminder after 12 days email subject', 'string', 30, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_after_13_days_ARRAY_subject', 2, 'A-SLS_Reminder for 1 day of trial period expires', NULL, 'Trial reminder after 13 days email subject', 'string', 32, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_when_expired_ARRAY_subject', 2, 'A-SLS_Reminder for 0 day of trial period expires', NULL, 'Trial reminder when expired email subject', 'string', 34, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_sorry_for_cancellation_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>We are sorry to see you go.</p>
<p>Your account has been cancelled, and you will not be charged in future.</p>
<p>We hope you have enjoyed your free trial.</p>
<p>In case you would like to re-subscribe, just&nbsp;<a href="{signUpLink}">sign up again</a>, choose the suitable plan and complete the subscription form.</p>
<p>If you have any billing questions, please contact our Customer Support Team at [Phone Number], Mon-Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>
<p>The A-SLS team</p>', NULL, 'Sorry for cancellation email message', 'text', 37, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_successful_charge_ARRAY_subject', 2, 'A-SLS_Successful subscription', NULL, 'Successful charge email subject', 'string', 38, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_allow_discount', 1, '1|0::1', NULL, 'Enable discount', 'bool', 2, '1', NULL, 'T');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_remaining_discount_subscription', 1, '2', NULL, 'Remaining discount subscription', 'float', 4, '2', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_smtp_host', 1, 'smtp.gmail.com', NULL, 'SMTP Host', 'string', 5, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_stripe_secret', 1, 'sk_test_UPYeBtZ0jabqHTdjYrrNJQQr', NULL, 'Stripe secret', 'string', 1, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_discount_limit', 1, '200', NULL, 'Discount for first XXX persons', 'float', 4, '1', NULL, 'T');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_discount_percent', 1, '20', NULL, 'Discount percent', 'float', 3, '1', NULL, 'T');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_smtp_port', 1, '465', NULL, 'SMTP Port', 'int', 6, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_forgot_password_ARRAY_subject', 2, 'A-SLS_Password Reset', NULL, 'Forgot password email subject', 'string', 10, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_smtp_pass', 1, 'V@123456', NULL, 'SMTP Password', 'string', 8, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_admin_email', 1, 'mrdamtn@gmail.com', NULL, 'Admin email', 'string', 9, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_trial_days', 1, '0.01', NULL, 'Number of trial days', 'float', 10, '1', NULL, 'T');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_admin_fee', 1, '10.7', NULL, 'Admin fee for refund', 'float', 12, '2', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_smtp_user', 1, 'pasls1001@gmail.com', NULL, 'SMTP Username', 'string', 7, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'o_website_url', 1, 'https://asls.herokuapp.com', NULL, 'Website URL', 'string', 11, '1', NULL, 'T');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_sign_up_confirmation_ARRAY_subject', 2, 'A-SLS_Confirmation for signup', NULL, 'Sign up confirmation email subject', 'string', 14, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_reset_password_inform_ARRAY_subject', 2, 'A-SLS_Successful Password Reset', NULL, 'Reset password inform email subject', 'string', 12, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_forgot_password_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>We have just received a password recover request for {email}.</p>
<p>Please click&nbsp;<a href="{resetPasswordUrl}">here</a>&nbsp;to reset your password. If you can not click on that link, please copy and paste on the&nbsp;web page.</p>
<p>Thank you for using A-SLS.</p>
<p>&nbsp;</p>
<p>Sincerely,</p>
<p>&nbsp;</p>
<p>The A-SLS team</p>', NULL, 'Forgot password email message', 'text', 11, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_reset_password_inform_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Your password has been reset recently.</p>
<p>Thank you for using A-SLS.</p>
<p>&nbsp;</p>
<p>Sincerely,</p>
<p>The A-SLS team</p>', NULL, 'Reset password inform email message', 'text', 13, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_activation_ARRAY_subject', 2, 'A-SLS_Instruction', NULL, 'Bank transfer activation email subject', 'string', 18, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_activation_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Your account has been activated for trial successfully. You can now link student account so that your child can enjoy our amazing learning system.</p>
<p>Please access&nbsp;<a href="{subscriptionLink}">your subscription</a>&nbsp;to assign.</p>
<p>&nbsp;</p>
<p>Sincerely,</p>
<p>&nbsp;</p>
<p>The A-SLS team.</p>', NULL, 'Bank transfer activation email message', 'text', 19, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_bank_transfer_cancellation_ARRAY_subject', 2, 'A-SLS_Subscription Cancellation Notification', NULL, 'Bank transfer cancelation email subject', 'string', 20, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_cancel_monthly_subscription_ARRAY_subject', 2, 'A-SLS_Successful cancellation', NULL, 'Cancel monthly subscription  email subject', 'string', 24, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_cancel_annually_subscription_ARRAY_subject', 2, 'A-SLS_Successful cancellation', NULL, 'Cancel annually subscription  email subject', 'string', 26, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_cancel_monthly_subscription_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>We are sorry to see you go.</p>
<p>Your account has been cancelled, and you will not be charged in future.</p>
<p>In case you would like to re-subscribe, just&nbsp;<a href="{signUpLink}">sign up</a>&nbsp;again, choose the suitable plan and complete the subscription form.</p>
<p>If you have any billing questions, please contact our Customer Support Team at 123467980, Mon-</p>
<p>Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>
<p>The A-SLS team</p>', NULL, 'Cancel monthly subscription  email message', 'text', 25, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_cancel_annually_subscription_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>We are sorry to see you go.</p>
<p>Your account has been cancelled, and you will not be charged in future.</p>
<p>You have used the subscription for [used months of subscription] months and will be refunded the corresponding amount with the unused months of subscription.</p>
<p>In case you would like to re-subscribe, just sign up again, choose the suitable plan and complete the subscription form.</p>
<p>If you have any billing questions, please contact our Customer Support Team at 123456789, Mon-</p>
<p>Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>
<p>The A-SLS team</p>', NULL, 'Cancel annually subscription  email message', 'text', 27, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_after_7_days_ARRAY_subject', 2, 'A-SLS_Reminder for 7 days of trial period expires', NULL, 'Trial reminder after 7 days email subject', 'string', 28, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_after_7_days_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Thanks for signing up for A-Smart Learning System. We hope you have enjoyed your Free Trial.</p>
<p>Your Free Trial will expire in 7&nbsp;days.</p>
<p>As a reminder, when your trial expires, your account will be automatically charged {price}/{type}</p>
<p>for {subject}. Visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to check your subscription status and you can&nbsp;<a href="{subscriptionDetailsLink}">upgrade</a>&nbsp;your plan as well.</p>
<p>If you would like to cancel your subscription, please visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to cancel the plan. For any billing questions, please contact our Customer Support Team immediately at [Phone Number], Mon-Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>&nbsp;</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>', NULL, 'Trial reminder after 7 days email message', 'text', 29, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_after_12_days_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Thanks for signing up for A-Smart Learning System. We hope you have enjoyed your Free Trial.</p>
<p>Your Free Trial will expire in&nbsp;2&nbsp;days.</p>
<p>As a reminder, when your trial expires, your account will be automatically charged {price}/{type}</p>
<p>for {subject}. Visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to check your subscription status and you can&nbsp;<a href="{subscriptionDetailsLink}">upgrade</a>&nbsp;your plan as well.</p>
<p>If you would like to cancel your subscription, please visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to cancel the plan. For any billing questions, please contact our Customer Support Team immediately at [Phone Number], Mon-Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>&nbsp;</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>', NULL, 'Trial reminder after 12 days email message', 'text', 31, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_after_13_days_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Thanks for signing up for A-Smart Learning System. We hope you have enjoyed your Free Trial.</p>
<p>Your Free Trial will expire in 1&nbsp;day.</p>
<p>As a reminder, when your trial expires, your account will be automatically charged {price}/{type}</p>
<p>for {subject}. Visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to check your subscription status and you can&nbsp;<a href="{subscriptionDetailsLink}">upgrade</a>&nbsp;your plan as well.</p>
<p>If you would like to cancel your subscription, please visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to cancel the plan. For any billing questions, please contact our Customer Support Team immediately at [Phone Number], Mon-Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>&nbsp;</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>', NULL, 'Trial reminder after 13 days email message', 'text', 33, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_subscribe_via_bank_transfer_ARRAY_subject', 2, 'Subscribe via bank transfer email subject', NULL, 'Subscribe via bank transfer email subject', 'string', 40, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_trial_reminder_when_expired_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Thanks for signing up for A-Smart Learning System. We hope you have enjoyed your Free Trial.</p>
<p>Your Free Trial will expire in&nbsp;0&nbsp;day.</p>
<p>As a reminder, when your trial expires, your account will be automatically charged {price}/{type}</p>
<p>for {subject}. Visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to check your subscription status and you can&nbsp;<a href="{subscriptionDetailsLink}">upgrade</a>&nbsp;your plan as well.</p>
<p>If you would like to cancel your subscription, please visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to cancel the plan. For any billing questions, please contact our Customer Support Team immediately at [Phone Number], Mon-Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>&nbsp;</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>', NULL, 'Trial reminder when expired message', 'text', 35, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_sorry_for_cancellation_ARRAY_subject', 2, 'A-SLS_Successful cancellation', NULL, 'Sorry for cancellation email subject', 'string', 36, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_successful_charge_ARRAY_message', 2, '<p>Dear {firstName} {lastName},</p>
<p>Thanks for signing up for A-Smart Learning System. We hope you have enjoyed your free trial.</p>
<p>Your Free Trial has expired and your account is automatically charged {price}/{type}&nbsp;for {subject}.</p>
<p>We are glad to keep you as a customer. Visit&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to check your subscription status and you can&nbsp;<a href="{subscriptionDetailsLink}">upgrade</a>&nbsp;your plan as well.</p>
<p>If you would like to cancel your subscription, please go to&nbsp;<a href="{subscriptionDetailsLink}">your subscription</a>&nbsp;to cancel it. If you have any billing questions, please contact our Customer Support Team at [Phone Number], Mon-Fri 9am - 6pm or just reply to this email. We will address your concerns as soon as possible.</p>
<p>&nbsp;</p>
<p>Thank you for using A-SLS.</p>
<p>Sincerely,</p>
<p>The A-SLS team</p>', NULL, 'Successful charge email message', 'text', 39, '1', NULL, 'F');
INSERT INTO options (foreign_id, key, tab_id, value, label, description, type, "order", is_visible, style, is_public) VALUES (1, 'mail_subscribe_via_bank_transfer_ARRAY_message', 2, '<p>Subscribe via bank transfer email message</p>', NULL, 'Subscribe via bank transfer email message', 'text', 41, '1', NULL, 'F');


-- Completed on 2017-05-11 01:35:55 ICT

--
-- PostgreSQL database dump complete
--

