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

const requestProperty = 'auth'; // token info will be included in req[requestProperty] property

const grantTypes = {
  access: 'access_token',
  refresh: 'refresh_token',
};

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
const signToken = (req, payload, options = {}) => getSecret(req, payload).then((secret) => {
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
const verifyToken = (req, res, next) => {
  const middleware = expressJwt({ secret: getSecret, requestProperty });
  return middleware(req, res, next);
};

export const generateAccessToken = (req, payload) => {
  const jwtOpts = Utils.copy(constants.auth.accessTokenOpts);
  if (typeof req.remember !== 'undefined' && typeof jwtOpts.expiresIn !== 'undefined') {
    // in case client choose remember me option when do login,
    // we will provide a token without expiry time.
    // When client do logout, we will revoke (delete) this token
    delete jwtOpts.expiresIn;
  }
  return signToken(req, { grantType: grantTypes.access, ...payload }, jwtOpts); // eslint-disable-line
};

export const generateRefreshToken = (req, payload) => {
  const hash = Utils.sha3Encrypt((payload.userId || payload.email || '') + Utils.getSalt());
  return signToken(req, { grantType: grantTypes.refresh, hash, ...payload }, constants.auth.accessTokenOpts); // eslint-disable-line
};

export const verifyAccessToken = (req, res, next) => verifyToken(req, res, (err) => {
  if (err) {
    return next(err);
  }
  if (req[requestProperty].grantType !== grantTypes.access) {
    return next(new APIError('Authentication error. Invalid token.', httpStatus.UNAUTHORIZED, true));
  }
  return next();
});

export const verifyRefreshToken = (req, res, next) => verifyToken(req, res, (err) => {
  if (err) {
    return next(err);
  }
  // verify grant type
  if (req[requestProperty].grantType !== grantTypes.refresh) {
    return next(new APIError('Authentication error. Invalid token.', httpStatus.UNAUTHORIZED, true));
  }
  // check if hash property included in refresh token is still be stored in DB or not,
  // because when user do logout, we have deleted the hash (userToken field in DB).
  const { hash } = req[requestProperty];
  return new UserModel().where('t1."userToken"=$1').findCount([hash]).then((cnt) => {
    if (cnt === 0) {
      return next(new APIError('Authentication error. No such token exists!.', httpStatus.UNAUTHORIZED, true));
    }
    return next();
  }).catch(e => next(e)); // eslint-disable-line
});

const generateTokens = (req, userId) => {
  const db = new UserModel();
  return db.where('t1._id::varchar=$1').findOne([userId]).then((user) => {
    //
    if (user === null) {
      return Promise.reject(new APIError('No such user exists!', httpStatus.NOT_FOUND));
    }
    //
    // create token data and user data to be returned in case of success
    const tokenData = {
      userId: user._id,
      email: user.email,
    };
    const userData = UserModel.extractData(user);
    // sign tokens
    const list = [
      generateAccessToken(req, tokenData), // create access token
      generateRefreshToken(req, tokenData), // create refresh token
    ];
    return Promise.all(list).then((tokensList) => { // eslint-disable-line
      // save into DB the hash property that is included in refresh token,
      // this hash will be used to renew access token later.
      // when user do logout, we MUST delete this hash from user record,
      // so that the refresh token cannot be used anymore.
      const { hash } = jwt.decode(tokensList[1]);
      if (Utils.isNotEmptyString(hash)) {
        db.reset().where('t1._id=$1').update({ userToken: hash }, [user._id]);
      }
      // return api reponse
      return Promise.resolve(new APIResponse({
        accessToken: tokensList[0],
        refreshToken: tokensList[1],
        ...userData,
      }));
    }).catch(e => Promise.reject(e));
    //
  }).catch(e => Promise.reject(e));
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export const login = (req, res, next) => {
  const db = new UserModel();
  db.where('t1.email=$1').findOne([req.body.username]).then((user) => {
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
    return generateTokens(req, user._id).then(tokenResp => res.json(tokenResp)).catch(e => Promise.reject(e)); // eslint-disable-line
  }).catch(e => { // eslint-disable-line
    if (Utils.isAppError(e.message || '')) {
      return next(e);
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  });
};

// before request to this function, please make sure that
// the verifyRefreshToken middleware MUST be applied in prior
export const renewAccessToken = (req, res, next) => {
  const { userId } = req[requestProperty];
  return generateTokens(req, userId).then(tokenResp => res.json(tokenResp)).catch(e => next(e)); // eslint-disable-line
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
// req[requestProperty] is assigned by jwt middleware if valid token is provided
export const getRandomNumber = (req, res) => res.json(new APIResponse({
  auth: req[requestProperty],
  num: Math.random() * 100
}));
