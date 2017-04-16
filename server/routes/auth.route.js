'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _APIResponse = require('../helpers/APIResponse');

var _APIResponse2 = _interopRequireDefault(_APIResponse);

var _paramValidation = require('../../config/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

var _auth = require('../controllers/auth.controller');

var authCtrl = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct email and password is provided */
router.route('/login').post((0, _expressValidation2.default)(_paramValidation2.default.login), authCtrl.login);

/** GET /api/auth/token - Send refresh token to renew access token */
router.route('/logout').get(authCtrl.verifyAccessToken, authCtrl.logout);

/** GET /api/auth/token - Send refresh token to renew access token */
router.route('/token').get(authCtrl.verifyRefreshToken, authCtrl.renewAccessToken);

/** GET /api/auth/checkToken - Send access token to check if it is valid and not expired */
router.route('/checkToken').get(authCtrl.verifyAccessToken, function (req, res) {
  return res.json(new _APIResponse2.default('OK'));
});

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number').get(authCtrl.verifyAccessToken, authCtrl.getRandomNumber);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=auth.route.js.map
