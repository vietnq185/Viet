'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // --------------------------------------------------------------------------------------------


var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _db = require('../../config/db');

var _db2 = _interopRequireDefault(_db);

var _Utils = require('../helpers/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('rest-api:app.postgres.model');

// --------------------------------------------------------------------------------------------

var FIND = {
  ONE: 'FIND_ONE_RECORD',
  ALL: 'FIND_ALL_RECORDS',
  COUNT: 'COUNT_RECORDS'
};

var defaultParams = {
  select: null, // String
  from: null, // String
  join: [], // Array of object: {table: String, on: String, type: String (optional, default: INNER)}
  where: [], // Array of String
  groupBy: null, // String
  having: null, // String
  orderBy: null, // String
  limit: null, // UInt
  offset: null };

var buildQuery = function buildQuery(fromTable, objParams) {
  var findType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FIND.ALL;

  var params = _Utils2.default.copy(objParams);
  var arrQuery = []; // eslint-disable-line
  switch (findType) {
    case FIND.COUNT:
      params.select = 'COUNT(*) AS "TOTAL_RECORDS"';
      break;
    case FIND.ONE:
      params.limit = 1;
      break;
    case FIND.ALL:
    default:
  }
  //
  if (params.select === null) {
    params.select = '*';
  }
  // SELECT
  arrQuery.push('SELECT ' + params.select);
  // FROM
  arrQuery.push('FROM ' + fromTable + ' AS t1');
  // JOIN
  if (_Utils2.default.isNotEmptyArray(params.join)) {
    for (var i = 0; i < params.join.length; i++) {
      //eslint-disable-line
      var join = params.join[i];
      arrQuery.push(join.type + ' JOIN ' + join.table + ' ON ' + join.on);
    }
  }
  // WHERE
  if (_Utils2.default.isNotEmptyArray(params.where)) {
    arrQuery.push('WHERE (' + params.where.join(') AND (') + ')');
  }
  // GROUP BY
  if (_Utils2.default.isNotEmptyString(params.groupBy)) {
    arrQuery.push('GROUP BY ' + params.groupBy);
  }
  // HAVING
  if (_Utils2.default.isNotEmptyString(params.having)) {
    arrQuery.push('HAVING ' + params.having);
  }
  // ORDER BY
  if (_Utils2.default.isNotEmptyString(params.orderBy)) {
    arrQuery.push('ORDER BY ' + params.orderBy);
  }
  // LIMIT
  var limit = parseInt(params.limit, 10);
  if (!isNaN(limit) && limit > 0) {
    arrQuery.push('LIMIT ' + limit);
  }
  // OFFSET
  var offset = parseInt(params.offset, 10);
  if (!isNaN(offset) && offset >= 0) {
    arrQuery.push('OFFSET ' + offset);
  }
  // return result
  var sql = arrQuery.join(' '); // eslint-disable-line
  debug('SQL Builder => build params: ', params);
  debug('SQL Builder => built query: ', sql);
  return sql;
};

// --------------------------------------------------------------------------------------------

/**
 * Class AppPostgresModel.
 */

var AppPostgresModel = function () {
  //
  function AppPostgresModel(table) {
    var primaryKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var schema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, AppPostgresModel);

    this._table = table; // String, table name
    this._primaryKey = primaryKey; // String, Single field primary key
    this._schema = schema; // Object

    this._params = _Utils2.default.copy(defaultParams); // Object, hold credentials to build SQL command
  }

  _createClass(AppPostgresModel, [{
    key: 'getTable',
    value: function getTable() {
      return this._table;
    }
  }, {
    key: 'getPrimaryKey',
    value: function getPrimaryKey() {
      return this._primaryKey;
    }
  }, {
    key: 'getSchema',
    value: function getSchema() {
      return this._schema;
    }

    /**
     * Execute a SQL command. This function behavior similar to pg.Pool.query function.
     * @param {String} sql
     * @returns {Promise}
     */

  }, {
    key: 'execute',
    value: function execute(sql, params) {
      // eslint-disable-line
      return _db2.default.query(sql, params);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._params = _Utils2.default.copy(defaultParams);
      return this;
    }
  }, {
    key: 'select',
    value: function select(command) {
      this._params.select = command;
      return this;
    }
  }, {
    key: 'where',
    value: function where(command) {
      this._params.where.push(command);
      return this;
    }
  }, {
    key: 'join',
    value: function join(table, on) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'INNER';

      this._params.join.push({ table: table, on: on, type: type });
      return this;
    }
  }, {
    key: 'groupBy',
    value: function groupBy(command) {
      this._params.groupBy = command;
      return this;
    }
  }, {
    key: 'having',
    value: function having(command) {
      this._params.having = command;
      return this;
    }
  }, {
    key: 'orderBy',
    value: function orderBy(command) {
      this._params.orderBy = command;
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(command) {
      this._params.limit = command;
      return this;
    }
  }, {
    key: 'offset',
    value: function offset(command) {
      this._params.offset = command;
      return this;
    }

    /**
     * Find a record.
     * @param {Array} values // Optional.
     * @returns {Promise}
     * Example:
     * const user = new UserModel();
     * const values = ['%88%', 'Dung'];
     * user.reset()
     *     .where('t1."firstName"=$2')
     *     .where("t1._id::varchar LIKE $1")
     *     .findOne(values)
     *     .then(r => res.send(r)).catch(e => next(e));
     */

  }, {
    key: 'findOne',
    value: function findOne() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var sql = buildQuery(this._table, this._params, FIND.ONE);
      return this.execute(sql, values).then(function (result) {
        // eslint-disable-line
        if (result && result.rows && result.rows.length > 0) {
          return _bluebird2.default.resolve(result.rows[0]);
        }
        return _bluebird2.default.resolve(null);
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    /**
     * Find all records.
     * @param {Array} values // Optional.
     * @returns {Promise}
     * Example:
     * const user = new UserModel();
     * const values = ['%88%', 'Dung', 'user'];
     * user.reset()
     *     .select('t2.title AS item_title, t1.*')
     *     .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
     *     .where('t1."firstName"=$2')
     *     .where("t1._id::varchar LIKE $1")
     *     .groupBy('t1._id, t1."firstName", t2.title')
     *     .having('t1."role" = $3')
     *     .orderBy('t1."firstName"')
     *     .limit(10)
     *     .offset(1)
     *     .findAll(values)
     *     .then(r => res.send(r)).catch(e => next(e));
     */

  }, {
    key: 'findAll',
    value: function findAll() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var sql = buildQuery(this._table, this._params, FIND.ALL);
      return this.execute(sql, values).then(function (result) {
        // eslint-disable-line
        if (result && result.rows && result.rows.length > 0) {
          return _bluebird2.default.resolve(result.rows);
        }
        return _bluebird2.default.resolve([]);
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    /**
     * Count all records.
     * @param {Array} values // Optional.
     * @returns {Promise}
     * Example 1:
     * const user = new UserModel();
     * const values = ['%88%', 'Dung', 'user'];
     * user.reset()
     *     .select('t2.title AS item_title, t1.*')
     *     .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
     *     .where('t1."firstName"=$2')
     *     .where("t1._id::varchar LIKE $1")
     *     .groupBy('t1._id, t1."firstName", t2.title')
     *     .having('t1."role" = $3')
     *     .orderBy('t1."firstName"')
     *     .limit(10)
     *     .offset(1)
     *     .findCount(values)
     *     .then(r => res.send(r)).catch(e => next(e));
     * Example 2:
     * const user = new UserModel();
     * const values = ['%88%', 'Dung'];
     * user.reset()
     *     .where('t1."firstName"=$2')
     *     .where("t1._id::varchar LIKE $1")
     *     .findCount(values)
     *     .then(r => res.send(r)).catch(e => next(e));
     */

  }, {
    key: 'findCount',
    value: function findCount() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var resultSql = buildQuery(this._table, this._params, FIND.COUNT);
      var sqlWithJoin = 'SELECT COUNT("___RESULT_TABLE"."TOTAL_RECORDS") AS "TOTAL_RECORDS" FROM (' + resultSql + ') AS "___RESULT_TABLE"';
      var sql = _Utils2.default.isNotEmptyArray(this._params.join) ? sqlWithJoin : resultSql;
      debug('COUNT COMMAND: ', sql);
      return this.execute(sql, values).then(function (result) {
        // eslint-disable-line
        var count = result && result.rows && result.rows.length > 0 && typeof result.rows[0].TOTAL_RECORDS !== 'undefined' ? parseInt(result.rows[0].TOTAL_RECORDS, 10) : 0;
        return _bluebird2.default.resolve(count);
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    /**
     * Find all records and parse into key => value object.
     * @param {Array} values // Optional.
     * @param {String|Array} arrKeyFields // a field or a list of fields
     * @param {String|Array} arrResultFields // Optional. A list of fields or * (means all)
     * @param {String} strKeySeparator // Optional. Separator beween key fields
     * @returns {Promise}
     * Example:
     * const user = new UserModel();
     * const values = ['%88%', 'Dung', 'user'];
     * const keyFields = ['_id', 'dateCreated', 'item_title'];
     * const valuesFields = ['_id', 'username', 'firstName', 'lastName'];
     * user.reset()
     *     .select('t2.title AS item_title, t1.*')
     *     .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
     *     .where('t1."firstName"=$2')
     *     .where("t1._id::varchar LIKE $1")
     *     .groupBy('t1._id, t1."firstName", t2.title')
     *     .having('t1."role" = $3')
     *     .orderBy('t1."firstName"')
     *     .limit(10)
     *     .offset(1)
     *     .getDataPair(values, keyFields, valuesFields)
     *     .then(r => res.send(r)).catch(e => next(e));
     */

  }, {
    key: 'getDataPair',
    value: function getDataPair() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var arrKeyFields = arguments[1];
      var arrResultFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '*';
      var strKeySeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '~:~';

      return this.findAll(values).then(function (results) {
        try {
          var objResults = _Utils2.default.getDataPair(results, arrKeyFields, arrResultFields, strKeySeparator); // eslint-disable-line
          return _bluebird2.default.resolve(objResults);
        } catch (err) {
          return _bluebird2.default.reject(err);
        }
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    /**
     * Insert a record.
     * @param {Object|Array} data // Data to insert
     * @returns {Promise}
     * Example:
     * const user = new UserModel();
     * user.insert({
     *    _id: '4089688e-cdba-4ad1-8b84-d7c102982e50',
     *    firstName: 'NGOC',
     *    lastName: 'DAM',
     *    phone: '0909091101'
     * }).then(r => res.send(r)).catch(e => next(e));
     */

  }, {
    key: 'insert',
    value: function insert(data) {
      var outputAsArray = true; // eslint-disable-line
      if (_Utils2.default.isNotEmptyObject(data)) {
        data = [data]; // eslint-disable-line
        outputAsArray = false;
      }
      //
      var vData = []; // eslint-disable-line
      var fields = []; // eslint-disable-line
      var values = []; // eslint-disable-line
      var counter = 0; // eslint-disable-line
      for (var i = 0; i < data.length; i++) {
        // eslint-disable-line
        var objData = data[i]; // eslint-disable-line
        var pValues = []; // eslint-disable-line
        for (var key in objData) {
          // eslint-disable-line
          if (objData.hasOwnProperty(key)) {
            // eslint-disable-line
            if (i === 0) {
              fields.push('"' + key + '"');
            }
            var value = objData[key];
            values.push(value);
            counter++; // eslint-disable-line
            pValues.push('$' + counter); // eslint-disable-line
          }
        }
        vData.push('(' + pValues.join(', ') + ')');
      }
      //
      var sql = 'INSERT INTO ' + this._table + '(' + fields.join(', ') + ') VALUES ' + vData.join(', ') + ' RETURNING *;';
      debug('INSERT COMMAND: ', sql);
      return this.execute(sql, values).then(function (result) {
        if (result && result.rows && result.rows.length > 0) {
          return _bluebird2.default.resolve(outputAsArray ? result.rows : result.rows[0]);
        }
        return _bluebird2.default.resolve(null);
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    /**
     * Update multiple records.
     * @param {Object} objData // Data to update
     * @param {Array} values // Optional.
     * @returns {Promise}
     * Example:
     * const user = new UserModel();
     * const updateData = {
     *    firstName: "--NGOC''injection updated" + new Date().getTime(),
     *    lastName: 'DAM updated',
     *    phone: '0909091101'
     * };
     * const values = ['%NGOC%'];
     * user.where('t1."firstName" LIKE $1')
     *     .update(updateData, values)
     *     .then(r => res.send(r))
     *     .catch(e => next(e));
     */

  }, {
    key: 'update',
    value: function update(objData) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var fields = []; // eslint-disable-line
      var counter = values.length; // eslint-disable-line
      for (var key in objData) {
        // eslint-disable-line
        if (objData.hasOwnProperty(key)) {
          // eslint-disable-line
          counter++; // eslint-disable-line
          fields.push(['"' + key + '"', '' + counter].join(' = $')); // field = $counter
          var value = objData[key];
          values.push(value);
        }
      }
      //
      var arrQuery = []; // eslint-disable-line
      arrQuery.push('UPDATE ONLY ' + this._table + ' AS t1');
      arrQuery.push('SET ' + fields.join(', '));
      // WHERE
      if (_Utils2.default.isNotEmptyArray(this._params.where)) {
        arrQuery.push('WHERE (' + this._params.where.join(') AND (') + ')');
      }
      arrQuery.push('RETURNING *;');
      //
      var sql = arrQuery.join(' ');
      debug('UPDATE COMMAND: ', sql);
      //
      return this.execute(sql, values).then(function (result) {
        if (result && result.rows && result.rows.length > 0) {
          return _bluebird2.default.resolve(result.rows);
        }
        return _bluebird2.default.resolve(null);
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    /**
     * Delete data.
     * @param {Array} values // Optional.
     * @returns {Promise}
     * Example:
     * const user = new UserModel();
     * user.where(`"_id"='4089688e-cdba-4ad1-8b84-d7c102982e50'`).delete()
     */

  }, {
    key: 'delete',
    value: function _delete() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var arrQuery = []; // eslint-disable-line
      arrQuery.push('DELETE FROM ' + this._table + ' AS t1');
      // WHERE
      if (_Utils2.default.isNotEmptyArray(this._params.where)) {
        arrQuery.push('WHERE (' + this._params.where.join(') AND (') + ')');
      }
      arrQuery.push('RETURNING *;');
      //
      var sql = arrQuery.join(' ');
      debug('DELETE COMMAND: ', sql);
      //
      return this.execute(sql, values).then(function (result) {
        if (result && result.rows && result.rows.length > 0) {
          return _bluebird2.default.resolve(result.rows);
        }
        return _bluebird2.default.resolve(null);
      }).catch(function (err) {
        return _bluebird2.default.reject(err);
      });
    }

    //

  }]);

  return AppPostgresModel;
}();

/**
 * @typedef AppPostgresModel
 */


exports.default = AppPostgresModel;
module.exports = exports['default'];
//# sourceMappingURL=app.postgres.model.js.map
