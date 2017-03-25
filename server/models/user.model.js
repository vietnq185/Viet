import Promise from 'bluebird';
import httpStatus from 'http-status';
import SQL from 'sql-template-strings';
import db from '../../config/db';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = {
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
};

/**
 * Class User.
 */
class User {
  //
  constructor(user = {}) {
    this._table = 'Users';
    this._schema = UserSchema;
    this._user = user;
  }

  static getTable() {
    return 'Users';
  }

  //
  save() {
    //this._user;
  }

  /**
   * Get user
   * @param {String} id - The Id of user.
   * @returns {Promise<UserSchema, APIError>}
   */
  static get(id) {
    const query = `SELECT * FROM ${User.getTable()} WHERE _id='${id}'`;
    return db.query(query).then((result) => { // eslint-disable-line
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows[0]);
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }).catch(err => Promise.reject(err));
  }

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} limit - Limit number of users to be returned.
   * @param {number} offset - Position to fetch data.
   * @returns {Promise<User[]>}
   */
  static list({ limit = 50, offset = 0 } = {}) {
    const query = `SELECT * FROM ${User.getTable()} LIMIT ${limit} OFFSET ${offset}`;
    return db.query(query).then((result) => { // eslint-disable-line
      if (result && result.rows && result.rows.length > 0) {
        return Promise.resolve(result.rows);
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }).catch(err => Promise.reject(err));
  }
  //
}

/**
 * @typedef User
 */
export default User;
