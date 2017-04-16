'use strict';

var _supertestAsPromised = require('supertest-as-promised');

var _supertestAsPromised2 = _interopRequireDefault(_supertestAsPromised);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// connect to postgres db
require('../../config/db');

_chai2.default.config.includeStack = true;

/**
 * root level hooks
 */
after(function (done) {
  done();
});

describe('## User APIs', function () {
  describe('# GET /api/health-check', function () {
    it('should return OK', function (done) {
      (0, _supertestAsPromised2.default)(_index2.default).get('/api/health-check').expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.text).to.equal('OK');
        done();
      }).catch(done);
    });
  });
});
//# sourceMappingURL=user.test.js.map
