'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// config should be imported before importing any other file
var debug = require('debug')('rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// print log for promise that unhandle rejection
process.on('unhandledRejection', function (e) {
  debug('%s %0', e.message, e.stack);
});

// connect to postgres db
require('./config/db');

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  _express2.default.listen(_config2.default.port, function () {
    debug('server started on port ' + _config2.default.port + ' (' + _config2.default.env + ')');
  });
}

exports.default = _express2.default;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
