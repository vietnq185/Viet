import httpStatus from 'http-status';

import UserModel from '../models/user.model';
import APIResponse from '../helpers/APIResponse';
import APIError from '../helpers/APIError';
import Utils from '../helpers/Utils';

const getReturnData = (userData) => {
  const fields = ['_id', 'username', 'password', 'email', 'phone', 'firstName', 'lastName'];
  var obj = {}; // eslint-disable-line
  for (var i = 0; i < fields.length; i++) { // eslint-disable-line
    const fn = fields[i];
    if (typeof userData[fn] !== 'undefined') {
      obj[fn] = userData[fn];
    }
  }
  return obj;
};

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  new UserModel().where('t1._id=$1').findOne([id])
    .then((user) => {
      // not found
      if (user === null) {
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return next(err);
      }
      // found
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {UserModel}
 */
function get(req, res) {
  return res.json(new APIResponse(getReturnData(req.user)));
}

/**
 * Create new user
 * @property {string} req.body.username
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.phone
 * @property {string} req.body.firstName
 * @property {string} req.body.lastName
 * @returns {UserModel}
 */
function create(req, res, next) {
  new UserModel().insert({
    _id: Utils.uuid(),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }).then(savedUser => res.json(new APIResponse(savedUser !== null ? getReturnData(savedUser) : savedUser))).catch(e => next(e)); // eslint-disable-line
}

/**
 * Update existing user
 * @property {string} req.body.username
 * @property {string} req.body.password // optional
 * @property {string} req.body.email // optional
 * @property {string} req.body.phone // optional
 * @property {string} req.body.firstName // optional
 * @property {string} req.body.lastName // optional
 * @returns {UserModel}
 */
function update(req, res, next) {
  const userData = req.user;
  userData.username = req.body.username;
  //
  const optionalParams = ['password', 'email', 'phone', 'firstName', 'lastName'];
  for (let i = 0; i < optionalParams.length; i++) { // eslint-disable-line
    const param = optionalParams[i];
    if (typeof req.body[param] !== 'undefined') {
      userData[param] = req.body[param];
    }
  }
  //
  new UserModel().where('t1._id=$1').update(userData, [userData._id])
    .then(savedUser => res.json(new APIResponse(savedUser !== null ? getReturnData(savedUser[0]) : savedUser))) // eslint-disable-line
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @returns {UserModel[]}
 */
function list(req, res, next) {
  const { limit = 50, offset = 0 } = req.query;
  new UserModel().select('t1."_id", t1."firstName", t1."lastName", t1."email", t1."phone", t1."metadata", t1."status"')
    .limit(limit).offset(offset)
    .findAll()
    .then(users => res.json(new APIResponse(users)))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {UserModel}
 */
function remove(req, res, next) {
  const userData = req.user;
  new UserModel().where('_id=$1').delete([userData._id])
    .then(deletedUser => res.json(new APIResponse(deletedUser !== null ? getReturnData(deletedUser[0]) : deletedUser))) // eslint-disable-line
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
