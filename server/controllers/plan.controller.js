'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = undefined;

var _plan = require('../models/plan.model');

var _plan2 = _interopRequireDefault(_plan);

var _APIResponse = require('../helpers/APIResponse');

var _APIResponse2 = _interopRequireDefault(_APIResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('rest-api:plan.controller'); // eslint-disable-line

/**
 * Get plan list.
 * @property {number} req.query.limit - Limit number of plans to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @returns {PlanModel[]}
 */
var list = exports.list = function list(req, res, next) {
  // eslint-disable-line
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$offset = _req$query.offset,
      offset = _req$query$offset === undefined ? 0 : _req$query$offset;

  new _plan2.default().select('t1.*, array_length("courseIds", 1) as cnt, ARRAY(SELECT t2.title FROM courses AS t2 WHERE t2._id = ANY(ARRAY[t1."courseIds"])) AS "courseTitles"').limit(limit).offset(offset).orderBy('cnt ASC, "courseTitles" ASC').findAll().then(function (plans) {
    return res.json(new _APIResponse2.default(plans));
  }).catch(function (e) {
    return next(e);
  });
};
//# sourceMappingURL=plan.controller.js.map
