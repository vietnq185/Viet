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

var _user = require('../controllers/user.controller');

var userCtrl = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
.get(authCtrl.verifyAccessToken, authCtrl.adminOrEditorAuth, userCtrl.list)

/** POST /api/users - Create new user */
.post((0, _expressValidation2.default)(_paramValidation2.default.createUser), userCtrl.create);

router.route('/:userId')
/** GET /api/users/:userId - Get user */
.get(authCtrl.verifyAccessToken, userCtrl.get)

/** PUT /api/users/:userId - Update user */
.put((0, _expressValidation2.default)(_paramValidation2.default.updateUser), authCtrl.verifyAccessToken, userCtrl.update)

/** DELETE /api/users/:userId - Delete user */
.delete(authCtrl.verifyAccessToken, userCtrl.remove);

router.route('/cclist/:userId')
/** GET /api/users/cclist/:userId - Get cclist of user */
.get(authCtrl.verifyAccessToken, userCtrl.cclist);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load); // router.param accepts only tow params, so that do no put authCtrl.verifyAccessToken here

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=user.route.js.map
