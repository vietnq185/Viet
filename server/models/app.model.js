// --------------------------------------------------------------------------------------------
import Promise from 'bluebird';
import escape from 'pg-escape';

import db from '../../config/db';
import Utils from '../helpers/Utils';

const debug = require('debug')('rest-api:base.model');

// --------------------------------------------------------------------------------------------

const FIND = {
  ONE: 'FIND_ONE_RECORD',
  ALL: 'FIND_ALL_RECORDS',
  COUNT: 'COUNT_RECORDS',
};

const defaultParams = {
  select: null, // String
  from: null, // String
  join: [], // Array of object: {table: String, on: String, type: String (optional, default: INNER)}
  where: [], // Array of String
  groupBy: null, // String
  having: null, // String
  orderBy: null, // String
  limit: null, // UInt
  offset: null, //UInt
};

const buildQuery = (fromTable, objParams, findType = FIND.ALL) => {
  const params = Utils.copy(objParams);
  let arrQuery = [];  // eslint-disable-line
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
  arrQuery.push(`SELECT ${params.select}`);
  // FROM
  arrQuery.push(`FROM ${fromTable} AS t1`);
  // JOIN
  if (Utils.isNotEmptyArray(params.join)) {
    for (let i = 0; i < params.join.length; i++) {
      const join = params.join[i];
      const joinType = (typeof join.type === 'string' && join.length > 0 ? join.type : 'INNER JOIN');
      arrQuery.push(`${joinType} ${join.table} ON ${join.table}`);
    }
  }
  // WHERE
  if (Utils.isNotEmptyArray(params.where)) {
    arrQuery.push(`WHERE (${params.where.join(') AND (')})`);
  }
  // GROUP BY
  if (Utils.isNotEmptyString(params.groupBy)) {
    arrQuery.push(`GROUP BY ${params.groupBy}`);
  }
  // HAVING
  if (Utils.isNotEmptyString(params.having)) {
    arrQuery.push(`HAVING ${params.having}`);
  }
  // ORDER BY
  if (Utils.isNotEmptyString(params.orderBy)) {
    arrQuery.push(`ORDER BY ${params.orderBy}`);
  }
  // LIMIT
  if (typeof params.limit === 'number' && params.limit > 0) {
    arrQuery.push(`LIMIT ${params.limit}`);
  }
  // OFFSET
  if (typeof params.offset === 'number' && params.offset >= 0) {
    arrQuery.push(`OFFSET ${params.offset}`);
  }
  // return result
  const sql = arrQuery.join(' ');
  debug('SQL Builder => build params: ', params);
  debug('SQL Builder => built query: ', sql);
  return sql;
};

// --------------------------------------------------------------------------------------------

/**
 * Class AppModel.
 */
class AppModel {
  //
  constructor(table, primaryKey = '', schema = {}) {
    this._table = table;  // String, table name
    this._primaryKey = primaryKey; // String, Single field primary key
    this._schema = schema;  // Object, for later usage

    this._params = Utils.copy(defaultParams); // Object, hold credentials to build SQL command
  }

  getTable() {
    return this._table;
  }

  getPrimaryKey() {
    return this._primaryKey;
  }

  getSchema() {
    return this._schema;
  }

  /**
   * Execute a SQL command. This function behavior similar to pg.Pool.query function.
   * @param {String} sql
   * @returns {Promise}
   */
  execute(sql, params) { // eslint-disable-line
    return db.query(sql, params);
  }

  reset() {
    this._params = Utils.copy(defaultParams);
    return this;
  }

  select(command) {
    this._params.select = command;
    return this;
  }

  where(command) {
    this._params.where.push(command);
    return this;
  }

  join(table, on, type = 'INNER JOIN') {
    this._params.join.push({ table, on, type });
    return this;
  }

  groupBy(command) {
    this._params.groupBy = command;
    return this;
  }

  having(command) {
    this._params.having = command;
    return this;
  }

  orderBy(command) {
    this._params.orderBy = command;
    return this;
  }

  limit(command) {
    this._params.limit = command;
    return this;
  }

  offset(command) {
    this._params.offset = command;
    return this;
  }

  /**
   * Find a record.
   * @param {String} id // Optional. Single field of primary key.
   * @returns {Promise}
   * Example:
   * const user = new UserModel();
   * const id = '12345678-1234-1234-1234-123456789012';
   * const firstName = 'NGOC';
   * user.reset().where(`"firstName"=${escape('%L', firstName)}`).find(id)
   */
  find(id = '') {
    if (typeof this._primaryKey === 'string' && this._primaryKey.length > 0 && typeof id !== 'undefined') {
      if (typeof id === 'number') {
        this._params.where.push(`${this._primaryKey} = ${id}`);
      } else if (typeof id === 'string' && id.length > 0) {
        this._params.where.push(`${this._primaryKey} = ${escape('%L', id)}`);
      }
    }
    const sql = buildQuery(this._table, this._params, FIND.ONE);
    return this.execute(sql).then((result) => {  // eslint-disable-line
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows[0]);
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  findAll() {
    const sql = buildQuery(this._table, this._params, FIND.ALL);
    return this.execute(sql).then((result) => {  // eslint-disable-line
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows);
      }
      return Promise.resolve([]);
    }).catch(err => Promise.reject(err));
  }

  findCount() {
    const sql = buildQuery(this._table, this._params, FIND.COUNT);
    return this.execute(sql).then((result) => {  // eslint-disable-line
      const count = (result && result.rows && result.rows.length > 0 && typeof result.rows[0].TOTAL_RECORDS !== 'undefined' ? result.rows[0].TOTAL_RECORDS : 0);
      return Promise.resolve(count);
    }).catch((err) => {
      Promise.reject(err);
    });
  }

  /**
   * Find all records and parse into key => value object.
   * @param {String|Array} arrKeyFields // a field or a list of fields
   * @param {String|Array} arrResultFields // Optional. A list of fields or * (means all)
   * @param {String} strKeySeparator // Optional. Separator beween key fields
   * @returns {Promise}
   * Example:
   * const user = new UserModel();
   * user.reset().where(`"firstName"=${escape('%L', firstName)}`).getDataPairs(['_id', 'firstName'], ['_id', 'firstName', 'lastName'])
   */
  getDataPairs(arrKeyFields, arrResultFields = '*', strKeySeparator = '~:~') {
    // convert one item of string to array
    if (!Utils.isNotEmptyArray(arrKeyFields)) {
      arrKeyFields = [arrKeyFields]; // eslint-disable-line
    }
    //
    const getKey = (item, fields, separator) => {
      var arr = []; // eslint-disable-line
      for (let i = 0; i < fields.length; i++) { // eslint-disable-line
        const fn = fields[i];
        arr.push(typeof item[fn] !== 'undefined' ? item[fn] : '');
      }
      return arr.join(separator);
    };
    //
    const getValue = (item, fields) => {
      var obj = {}; // eslint-disable-line
      for (let i = 0; i < fields.length; i++) { // eslint-disable-line
        const fn = fields[i];
        obj[fn] = (typeof item[fn] !== 'undefined' ? item[fn] : null);
      }
      return obj;
    };
    //
    return this.findAll().then((results) => {
      var objResults = {}; // eslint-disable-line
      for (var i = 0; i < results.length; i++) { // eslint-disable-line
        const item = results[i];
        //
        const key = getKey(item, arrKeyFields, strKeySeparator);
        //
        const value = Utils.isNotEmptyArray(arrResultFields) ? getValue(item, arrResultFields) : item; // eslint-disable-line
        //
        objResults[key] = value; // eslint-disable-line
        //
      }
      return Promise.resolve(objResults);
    }).catch(err => Promise.reject(err));
    //
  }


  //
}

/**
 * @typedef AppModel
 */
export default AppModel;
