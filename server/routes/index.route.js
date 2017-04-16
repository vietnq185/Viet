'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('./user.route');

var _user2 = _interopRequireDefault(_user);

var _auth = require('./auth.route');

var _auth2 = _interopRequireDefault(_auth);

var _plan = require('./plan.route');

var _plan2 = _interopRequireDefault(_plan);

var _test = require('./test.route');

var _test2 = _interopRequireDefault(_test);

var _subscription = require('./subscription.route');

var _subscription2 = _interopRequireDefault(_subscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
  return res.send('OK');
});

// mount auth routes at /plans
router.use('/plans', _plan2.default);

// mount user routes at /users
router.use('/users', _user2.default);

// mount auth routes at /auth
router.use('/auth', _auth2.default);

// mount subscriptions routes at /auth
router.use('/subscriptions', _subscription2.default);

// mount test routes at /test
router.use('/test', _test2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=index.route.js.map
