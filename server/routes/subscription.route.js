'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _paramValidation = require('../../config/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

var _auth = require('../controllers/auth.controller');

var authCtrl = _interopRequireWildcard(_auth);

var _subscription = require('../controllers/subscription.controller');

var subscriptionCtrl = _interopRequireWildcard(_subscription);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/* eslint-disable */
router.route('/')
/** POST /api/subscriptions - Create new subscription */
.post((0, _expressValidation2.default)(_paramValidation2.default.createSubscription), subscriptionCtrl.create);

router.route('/AssignStudent')
/** POST /api/subscriptions/AssignStudent - Assign student */
.post( /* authCtrl.verifyAccessToken, */subscriptionCtrl.assignStudent);

router.route('/UpdateCardIdForSubscription')
/** POST /api/subscriptions/UpdateCardIdForSubscription - Update card id for subscription */
.post( /* authCtrl.verifyAccessToken, */subscriptionCtrl.UpdateCardIdForSubscription);

router.route('/list/:userId/:page')
/** GET /api/subscriptions/:userId - Get subscriptions */
.get( /* authCtrl.verifyAccessToken, */subscriptionCtrl.getSubscriptionsByUser);

router.route('/countSubscriptions')
/** GET /api/subscriptions/countSubscriptions - Count subscriptions */
.get( /* authCtrl.verifyAccessToken, */subscriptionCtrl.countSubscriptions);

router.route('/details/:subscriptionId')
/** GET /api/subscriptions/:subscriptionId - Get subscription details */
.get( /* authCtrl.verifyAccessToken, */subscriptionCtrl.getSubscriptionById);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=subscription.route.js.map
