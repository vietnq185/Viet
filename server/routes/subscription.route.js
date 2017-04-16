/* eslint-disable */
import express from 'express';
import validate from 'express-validation';

import paramValidation from '../../config/param-validation';
import * as authCtrl from '../controllers/auth.controller';
import * as subscriptionCtrl from '../controllers/subscription.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/subscriptions - Create new subscription */
  .post(validate(paramValidation.createSubscription), subscriptionCtrl.create);

router.route('/AssignStudent')
  /** POST /api/subscriptions/AssignStudent - Assign student */
  .post(/* authCtrl.verifyAccessToken, */subscriptionCtrl.assignStudent);

router.route('/UpdateCardIdForSubscription')
  /** POST /api/subscriptions/UpdateCardIdForSubscription - Update card id for subscription */
  .post(/* authCtrl.verifyAccessToken, */subscriptionCtrl.UpdateCardIdForSubscription);

router.route('/list/:userId/:page')
  /** GET /api/subscriptions/:userId - Get subscriptions */
  .get(/* authCtrl.verifyAccessToken, */subscriptionCtrl.getSubscriptionsByUser);

router.route('/countSubscriptions')
  /** GET /api/subscriptions/countSubscriptions - Count subscriptions */
  .get(/* authCtrl.verifyAccessToken, */subscriptionCtrl.countSubscriptions);

router.route('/details/:subscriptionId')
  /** GET /api/subscriptions/:subscriptionId - Get subscription details */
  .get(/* authCtrl.verifyAccessToken, */subscriptionCtrl.getSubscriptionById);

router.route('/changeStatus/:subscriptionId/:newStatus')
  /** GET /api/subscriptions/changeStatus/:subscriptionId/:newStatus - Get subscription details */
  .get(/* authCtrl.verifyAccessToken, */subscriptionCtrl.changeStatus);

export default router;
