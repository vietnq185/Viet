'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClient = undefined;

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _pgConnectionString = require('pg-connection-string');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('rest-api:db'); /*eslint-disable*/

var pgConfig = (0, _pgConnectionString.parse)(_config2.default.postgres);

var count = 0;

var pool = null;

if (pool === null) {
  pool = new _pg2.default.Pool(pgConfig);

  //
  pool.on('connect', function (client) {
    client.count = ++count;
    debug('postgres conneted clients: ', client.count);
  });

  //
  pool.on('error', function (err, client) {
    debug('postgres idle client error: ', err.message, err.stack);
  });
}

exports.default = pool;
var getClient = exports.getClient = function getClient() {
  return new Promise(function (resolve, reject) {
    if (pool !== null) {
      return pool.connect().then(resolve).catch(reject);
    }
    debug('getClient => postgres pool is not ready');
    return reject(new Error('postgres pool is not ready'));
  });
};
//# sourceMappingURL=db.js.map
