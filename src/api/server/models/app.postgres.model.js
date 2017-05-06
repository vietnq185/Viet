// --------------------------------------------------------------------------------------------
import Promise from 'bluebird';

import db from '../../config/db';
import Utils from '../helpers/Utils';

const debug = require('debug')('rest-api:app.postgres.model');

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
    for (let i = 0; i < params.join.length; i++) { //eslint-disable-line
      const join = params.join[i];
      arrQuery.push(`${join.type} JOIN ${join.table} ON ${join.on}`);
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
  const limit = parseInt(params.limit, 10);
  if (!isNaN(limit) && limit > 0) {
    arrQuery.push(`LIMIT ${limit}`);
  }
  // OFFSET
  const offset = parseInt(params.offset, 10);
  if (!isNaN(offset) && offset >= 0) {
    arrQuery.push(`OFFSET ${offset}`);
  }
  // return result
  const sql = arrQuery.join(' '); // eslint-disable-line
  debug('SQL Builder => build params: ', params);
  debug('SQL Builder => built query: ', sql);
  return sql;
};

// --------------------------------------------------------------------------------------------

/**
 * Class AppPostgresModel.
 */
class AppPostgresModel {
  //
  constructor(table, primaryKey = '', schema = {}) {
    this._table = table;  // String, table name
    this._primaryKey = primaryKey; // String, Single field primary key
    this._schema = schema;  // Object

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

  join(table, on, type = 'INNER') {
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
  findOne(values = []) {
    const sql = buildQuery(this._table, this._params, FIND.ONE);
    return this.execute(sql, values).then((result) => {  // eslint-disable-line
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows[0]);
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
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
  findAll(values = []) {
    const sql = buildQuery(this._table, this._params, FIND.ALL);
    return this.execute(sql, values).then((result) => {  // eslint-disable-line
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows);
      }
      return Promise.resolve([]);
    }).catch(err => Promise.reject(err));
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
  findCount(values = []) {
    const resultSql = buildQuery(this._table, this._params, FIND.COUNT);
    const sqlExt = `SELECT COUNT("___RESULT_TABLE"."TOTAL_RECORDS") AS "TOTAL_RECORDS" FROM (${resultSql}) AS "___RESULT_TABLE"`;
    const sql = (Utils.isNotEmptyString(this._params.groupBy) ? sqlExt : resultSql);
    debug('COUNT COMMAND: ', sql);
    return this.execute(sql, values).then((result) => {  // eslint-disable-line
      const count = (result && result.rows && result.rows.length > 0 && typeof result.rows[0].TOTAL_RECORDS !== 'undefined' ? parseInt(result.rows[0].TOTAL_RECORDS, 10) : 0);
      return Promise.resolve(count);
    }).catch(err => Promise.reject(err));
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
  getDataPair(values = [], arrKeyFields, arrResultFields = '*', strKeySeparator = '~:~') {
    return this.findAll(values).then((results) => {
      try {
        const objResults = Utils.getDataPair(results, arrKeyFields, arrResultFields, strKeySeparator); // eslint-disable-line
        return Promise.resolve(objResults);
      } catch (err) {
        return Promise.reject(err);
      }
    }).catch(err => Promise.reject(err));
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
  insert(data) {
    var outputAsArray = true; // eslint-disable-line
    if (Utils.isNotEmptyObject(data)) {
      data = [data]; // eslint-disable-line
      outputAsArray = false;
    }
    //
    var vData = []; // eslint-disable-line
    var fields = []; // eslint-disable-line
    var values = []; // eslint-disable-line
    var counter = 0; // eslint-disable-line
    for (var i = 0; i < data.length; i++) { // eslint-disable-line
      var objData = data[i]; // eslint-disable-line
      var pValues = []; // eslint-disable-line
      for (var key in objData) { // eslint-disable-line
        if (objData.hasOwnProperty(key)) { // eslint-disable-line
          if (i === 0) {
            fields.push(`"${key}"`);
          }
          const value = objData[key];
          values.push(value);
          counter++;  // eslint-disable-line
          pValues.push('$' + counter);  // eslint-disable-line
        }
      }
      vData.push(`(${pValues.join(', ')})`);
    }
    //
    const sql = `INSERT INTO ${this._table}(${fields.join(', ')}) VALUES ${vData.join(', ')} RETURNING *;`;
    debug('INSERT COMMAND: ', sql);
    return this.execute(sql, values).then((result) => {
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(outputAsArray ? result.rows : result.rows[0]);
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
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
  update(objData, values = []) {
    var fields = []; // eslint-disable-line
    var counter = values.length; // eslint-disable-line
    for (var key in objData) { // eslint-disable-line
      if (objData.hasOwnProperty(key)) { // eslint-disable-line
        counter++;  // eslint-disable-line
        fields.push([`"${key}"`, `${counter}`].join(' = $')); // field = $counter
        const value = objData[key];
        values.push(value);
      }
    }
    //
    var arrQuery = []; // eslint-disable-line
    arrQuery.push(`UPDATE ONLY ${this._table} AS t1`);
    arrQuery.push(`SET ${fields.join(', ')}`);
    // WHERE
    if (Utils.isNotEmptyArray(this._params.where)) {
      arrQuery.push(`WHERE (${this._params.where.join(') AND (')})`);
    }
    arrQuery.push('RETURNING *;');
    //
    const sql = arrQuery.join(' ');
    debug('UPDATE COMMAND: ', sql);
    //
    return this.execute(sql, values).then((result) => {
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows);
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  /**
   * Delete data.
   * @param {Array} values // Optional.
   * @returns {Promise}
   * Example:
   * const user = new UserModel();
   * user.where(`"_id"='4089688e-cdba-4ad1-8b84-d7c102982e50'`).delete()
   */
  delete(values = []) {
    var arrQuery = []; // eslint-disable-line
    arrQuery.push(`DELETE FROM ${this._table} AS t1`);
    // WHERE
    if (Utils.isNotEmptyArray(this._params.where)) {
      arrQuery.push(`WHERE (${this._params.where.join(') AND (')})`);
    }
    arrQuery.push('RETURNING *;');
    //
    const sql = arrQuery.join(' ');
    debug('DELETE COMMAND: ', sql);
    //
    return this.execute(sql, values).then((result) => {
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows);
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  //
}

/**
 * @typedef AppPostgresModel
 */
export default AppPostgresModel;
