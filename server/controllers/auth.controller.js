import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import httpStatus from 'http-status';

import APIError from '../helpers/APIError';
import APIResponse from '../helpers/APIResponse';
import Utils from '../helpers/Utils';
import config from '../../config/config';
import constants from '../../config/constants';
import UserModel from '../models/user.model';

const debug = require('debug')('rest-api:user.controller'); // eslint-disable-line

/**
 * get secret
 * @param {object} req of exppress
 * @param {object} payload
 * @param {function} next(err, secret)
 * @returns {Promise}
 */
// As reference at https://www.npmjs.com/package/express-jwt
// This function MUST call the callback, so that it can use secret to verify the token
const getSecret = (req, payload, next = () => { }) => {
  //
  const err = null; // default, no error

  // get secret async (if any)
  const secret = config.jwtSecret;

  // then check for error (if any)
  // TODO

  // MUST execute callback, for express-jwt as refs at https://www.npmjs.com/package/express-jwt
  next(err, secret);

  // return when success
  return Promise.resolve(secret);

  // return when fail
  // TODO: return Promise.resolve(err);
};

/**
 * sign token
 * @param {object} req of exppress
 * @param {object} payload
 * @param {ojbject} options
 * @returns {string} // created token
 */
export const signToken = (req, payload, options = {}) => getSecret(req, payload).then((secret) => {
  const token = (Utils.isNotEmptyObject(options) ? jwt.sign(payload, secret, options) : jwt.sign(payload, secret)); // eslint-disable-line
  return Promise.resolve(token);
}).catch(e => Promise.reject(e));

/**
 * Middleware to verify token for a request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export const verifyToken = (req, res, next) => {
  const middleware = expressJwt({ secret: getSecret, requestProperty: 'auth' });
  return middleware(req, res, next);
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export const login = (req, res, next) => {
  new UserModel().where('t1.email=$1').findOne([req.body.username]).then((user) => {
    // verify email and password
    if (user === null) {
      const err = new APIError(constants.errors.wrongUsername, httpStatus.UNAUTHORIZED, true);
      return Promise.reject(err);
    }
    if (user.hashedPassword !== Utils.encrypt(req.body.password, user.salt)) {
      const err = new APIError(constants.errors.wrongPassword, httpStatus.UNAUTHORIZED, true);
      return Promise.reject(err);
    }
    // create token data and user data to be returned in case of success
    const tokenData = {
      jti: user.email, // json token id
    };
    const userData = UserModel.extractData(user);
    // sign token
    return signToken(req, tokenData).then((token) => { // eslint-disable-line
      return res.json(new APIResponse({ token, ...userData }));
    }).catch(e => Promise.reject(e));
  }).catch(e => { // eslint-disable-line
    if (Utils.isAppError(e.message || '')) {
      return next(e);
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  });
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
// req.user is assigned by jwt middleware if valid token is provided
export const getRandomNumber = (req, res) => res.json(new APIResponse({
  auth: req.auth,
  num: Math.random() * 100
}));
