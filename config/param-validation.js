'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // POST /api/users
  createUser: {
    body: {
      email: _joi2.default.string().required().email(),
      password: _joi2.default.string().required().min(8).max(50),
      firstName: _joi2.default.string().required(),
      lastName: _joi2.default.string().required(),
      // in case admin, editor or parent create a teacher or student,
      // the parentId field will refer to user field in user_roles table.
      parentId: _joi2.default.string().guid(),
      status: _joi2.default.array().items(_joi2.default.string().valid('parent', 'student')) }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: _joi2.default.string().email(), // optional
      password: _joi2.default.string().min(8).max(50), // optional
      firstName: _joi2.default.string(), // optional
      lastName: _joi2.default.string(), // optional
      // in case admin, editor or parent create a teacher or student,
      // the parentId field will refer to user field in user_roles table.
      parentId: _joi2.default.string().guid(), // optional
      status: _joi2.default.array().items(_joi2.default.string().valid('parent', 'student')) },
    params: {
      userId: _joi2.default.string().guid().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: _joi2.default.string().required().email(),
      password: _joi2.default.string().required().min(8).max(50)
    }
  },

  // Create subscription /api/subscriptions
  createSubscription: {
    body: {
      parentId: _joi2.default.string().guid(), // optional
      planId: _joi2.default.string().guid() // optional
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=param-validation.js.map
