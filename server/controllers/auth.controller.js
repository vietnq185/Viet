'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomNumber = exports.getJwtInfo = exports.userAuth = exports.adminOrEditorAuth = exports.editorAuth = exports.adminAuth = exports.isUser = exports.isEditor = exports.isAdmin = exports.isAuth = exports.renewAccessToken = exports.logout = exports.login = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _APIResponse = require('../helpers/APIResponse');

var _APIResponse2 = _interopRequireDefault(_APIResponse);

var _Utils = require('../helpers/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _constants = require('../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('rest-api:user.controller'); // eslint-disable-line

// ------------------------------------------------------------------------------------------------

var blTimerList = {}; // to keep timer id, use to clear the timer

var blacklist = {}; // object to hold access token when user do logout

var blacklistDebug = function blacklistDebug() {
  // debug('---------------> blacklist cnt = %s: ', Object.keys(blacklist).length, blacklist);
  // debug('---------------> blTimerList cnt = %s: ', Object.keys(blTimerList).length, blTimerList);
};

var blKey = function blKey(userId) {
  return _Utils2.default.sha3Encrypt(userId);
};

var isBlacklist = function isBlacklist(userId, iat) {
  blacklistDebug();
  var key = blKey(userId);
  if (typeof blacklist[key] === 'undefined') {
    return false;
  }
  var blUser = blacklist[key];
  if (typeof blUser[iat] === 'undefined') {
    return false;
  }
  return true;
};

var addBLTimer = function addBLTimer(userId, iat) {
  if (!_config2.default.jwtBlacklistEnabled) return;
  var autoRemoveBL = function autoRemoveBL(_userId, _iat) {
    try {
      var _timerKey = _Utils2.default.sha3Encrypt(_userId + _iat);
      if (typeof blTimerList[_timerKey] !== 'undefined') {
        removeFromBlacklist(_userId, _iat); // eslint-disable-line
        clearInterval(blTimerList[_timerKey]);
        delete blTimerList[_timerKey];
        blacklistDebug();
      }
    } catch (e) {} //eslint-disable-line
  };
  // add 1000 (milisecond) to exp time to make sure that
  // the item in blacklist will be deleted after token is expired
  var exp = iat + _constants2.default.auth.accessTokenOpts.expiresIn;
  var now = new Date().getTime();
  var executeAfter = exp * 1000 - now + 1000; // eslint-disable-line
  // set timer to auto delete when token expiry.
  if (executeAfter > 0) {
    var timerKey = _Utils2.default.sha3Encrypt(userId + iat);
    var timerId = setInterval(function () {
      autoRemoveBL(userId, iat);
    }, executeAfter);
    blTimerList[timerKey] = timerId;
  }
};

var addToBlacklist = function addToBlacklist(userId, iat) {
  if (!_config2.default.jwtBlacklistEnabled) return;
  var exp = iat + _constants2.default.auth.accessTokenOpts.expiresIn;
  var key = blKey(userId);
  if (typeof blacklist[key] === 'undefined') {
    blacklist[key] = {};
  }
  blacklist[key][iat] = { iat: { userId: userId, exp: exp } };
  blacklistDebug();
  addBLTimer(userId, iat);
};

var removeFromBlacklist = function removeFromBlacklist(userId, iat) {
  if (!_config2.default.jwtBlacklistEnabled) return;
  try {
    if (isBlacklist(userId, iat)) {
      var key = blKey(userId);
      delete blacklist[key][iat];
      if (Object.keys(blacklist[key]).length === 0) {
        delete blacklist[key];
      }
      blacklistDebug();
    }
  } catch (e) {} // eslint-disable-line
};

// ------------------------------------------------------------------------------------------------

var requestProperty = 'auth'; // token info will be included in req[requestProperty] property

var grantTypes = {
  access: 'access_token',
  refresh: 'refresh_token'
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
var getSecret = function getSecret(req, payload) {
  var next = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  //
  var err = null; // default, no error

  // get secret async (if any)
  var secret = _config2.default.jwtSecret;

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
var signToken = function signToken(req, payload) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return getSecret(req, payload).then(function (secret) {
    var token = _Utils2.default.isNotEmptyObject(options) ? _jsonwebtoken2.default.sign(payload, secret, options) : _jsonwebtoken2.default.sign(payload, secret); // eslint-disable-line
    return Promise.resolve(token);
  }).catch(function (e) {
    return Promise.reject(e);
  });
};

/**
 * Middleware to verify token for a request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var verifyToken = function verifyToken(req, res, next) {
  var middleware = (0, _expressJwt2.default)({ secret: getSecret, requestProperty: requestProperty });
  return middleware(req, res, next);
};

// ------------------------------------------------------------------------------------------------

var generateAccessToken = exports.generateAccessToken = function generateAccessToken(req, payload) {
  var jwtOpts = _Utils2.default.copy(_constants2.default.auth.accessTokenOpts);
  if (typeof req.remember !== 'undefined' && typeof jwtOpts.expiresIn !== 'undefined') {
    // in case client choose remember me option when do login,
    // we will provide a token without expiry time.
    // When client do logout, we will revoke (delete) this token
    delete jwtOpts.expiresIn;
  }
  return signToken(req, _extends({ grantType: grantTypes.access }, payload), jwtOpts); // eslint-disable-line
};

var generateRefreshToken = exports.generateRefreshToken = function generateRefreshToken(req, payload) {
  var hash = _Utils2.default.sha3Encrypt((payload.userId || payload.email || '') + _Utils2.default.getSalt());
  return signToken(req, _extends({ grantType: grantTypes.refresh, hash: hash }, payload), _constants2.default.auth.accessTokenOpts); // eslint-disable-line
};

var verifyAccessToken = exports.verifyAccessToken = function verifyAccessToken(req, res, next) {
  return verifyToken(req, res, function (err) {
    if (err) {
      return next(err);
    }
    if (req[requestProperty].grantType !== grantTypes.access) {
      return next(new _APIError2.default('Authentication error. Invalid token.', _httpStatus2.default.UNAUTHORIZED, true));
    }
    if (isBlacklist(req[requestProperty].userId, req[requestProperty].iat)) {
      return next(new _APIError2.default('Authentication error. Invalid token. Please login again.', _httpStatus2.default.UNAUTHORIZED, true));
    }
    return next();
  });
};

var verifyRefreshToken = exports.verifyRefreshToken = function verifyRefreshToken(req, res, next) {
  return verifyToken(req, res, function (err) {
    if (err) {
      return next(err);
    }
    // verify grant type
    if (req[requestProperty].grantType !== grantTypes.refresh) {
      return next(new _APIError2.default('Authentication error. Invalid token.', _httpStatus2.default.UNAUTHORIZED, true));
    }
    // check if hash property included in refresh token is still be stored in DB or not,
    // because when user do logout, we have deleted the hash (userToken field in DB).
    var hash = req[requestProperty].hash;

    return new _user2.default().where('t1."userToken"=$1').findCount([hash]).then(function (cnt) {
      if (cnt === 0) {
        return next(new _APIError2.default('Authentication error. No such token exists!.', _httpStatus2.default.UNAUTHORIZED, true));
      }
      return next();
    }).catch(function (e) {
      return next(e);
    }); // eslint-disable-line
  });
};

var generateTokens = function generateTokens(req, userId) {
  var db = new _user2.default();
  return db.where('t1._id::varchar=$1').findOne([userId]).then(function (user) {
    //
    if (user === null) {
      return Promise.reject(new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND));
    }
    //
    // create token data and user data to be returned in case of success
    var tokenData = {
      userId: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      isAdmin: user.role.toLowerCase() === 'admin',
      isEditor: user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'editor',
      isUser: user.role.toLowerCase() === 'user',
      isTeacher: user.status.indexOf('teacher') !== -1 || user.status.indexOf('TEACHER') !== -1,
      isParent: user.status.indexOf('parent') !== -1 || user.status.indexOf('PARENT') !== -1
    };
    tokenData.isStudent = user.status.indexOf('student') !== -1 || user.status.indexOf('STUDENT') !== -1 || !tokenData.isTeacher && !tokenData.isParent;
    var userData = _user2.default.extractData(user);
    // sign tokens
    var list = [generateAccessToken(req, tokenData), // create access token
    generateRefreshToken(req, tokenData)];
    return Promise.all(list).then(function (tokensList) {
      // eslint-disable-line
      // save into DB the hash property that is included in refresh token,
      // this hash will be used to renew access token later.
      // when user do logout, we MUST delete this hash from user record,
      // so that the refresh token cannot be used anymore.
      var jwtData = _jsonwebtoken2.default.decode(tokensList[1]);
      if (_Utils2.default.isNotEmptyString(jwtData.hash)) {
        db.reset().where('t1._id::varchar=$1').update({ userToken: jwtData.hash }, [user._id]);
      }
      jwtData.accessToken = tokensList[0];
      jwtData.refreshToken = tokensList[1];
      // return api reponse
      return Promise.resolve(new _APIResponse2.default(_extends({}, userData, {
        jwt: jwtData
      })));
    }).catch(function (e) {
      return Promise.reject(e);
    });
    //
  }).catch(function (e) {
    return Promise.reject(e);
  });
};

// ------------------------------------------------------------------------------------------------

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var login = exports.login = function login(req, res, next) {
  blacklistDebug();
  var db = new _user2.default();
  db.where('t1.email=$1').findOne([req.body.username]).then(function (user) {
    // verify email and password
    if (user === null) {
      var err = new _APIError2.default(_constants2.default.errors.wrongUsername, _httpStatus2.default.UNAUTHORIZED, true);
      return Promise.reject(err);
    }
    if (user.hashedPassword !== _Utils2.default.encrypt(req.body.password, user.salt)) {
      var _err = new _APIError2.default(_constants2.default.errors.wrongPassword, _httpStatus2.default.UNAUTHORIZED, true);
      return Promise.reject(_err);
    }
    // create token data and user data to be returned in case of success
    return generateTokens(req, user._id).then(function (tokenResp) {
      return res.json(tokenResp);
    }).catch(function (e) {
      return Promise.reject(e);
    }); // eslint-disable-line
  }).catch(function (e) {
    // eslint-disable-line
    if (_Utils2.default.isAppError(e.message || '')) {
      return next(e);
    }
    var err = new _APIError2.default('Authentication error', _httpStatus2.default.UNAUTHORIZED, true);
    return next(err);
  });
};

var logout = exports.logout = function logout(req, res, next) {
  //
  var isRevoked = function isRevoked(req, payload, done) {
    // eslint-disable-line
    var userId = payload.userId,
        iat = payload.iat;

    return new _user2.default().where('t1._id::varchar=$1').update({ userToken: '' }, [userId]).then(function (results) {
      if (results === null) {
        // not updated
        return done(new _APIError2.default('Cannot revoke refresh token', _httpStatus2.default.UNAUTHORIZED, true));
      }

      // add to blacklist,
      // when current time reach exp OR when user re-login,
      // will delete from the list.
      addToBlacklist(userId, iat);

      // updated
      return done(null, true);
    }).catch(function (e) {
      return done(e);
    }); // eslint-disable-line
  };
  //
  var middleware = (0, _expressJwt2.default)({ secret: getSecret, requestProperty: requestProperty, isRevoked: isRevoked });
  return middleware(req, res, function (err) {
    if (err) {
      // when revoke success, an error will be returned from express-jwt,
      // this error has code = revoked_token, so in this case, it means logout success
      if (err.code === 'revoked_token') {
        return res.status(_httpStatus2.default.OK).json(new _APIResponse2.default({ message: 'logout success' }));
      }
      return next(err);
    }
    return next(new _APIError2.default(_constants2.default.errors.logoutError, _httpStatus2.default.UNAUTHORIZED, true));
  });
};

// before request to this function, please make sure that
// the verifyRefreshToken middleware MUST be applied in prior
var renewAccessToken = exports.renewAccessToken = function renewAccessToken(req, res, next) {
  var _req$requestProperty = req[requestProperty],
      userId = _req$requestProperty.userId,
      iat = _req$requestProperty.iat;

  addToBlacklist(userId, iat);
  return generateTokens(req, userId).then(function (tokenResp) {
    return res.json(tokenResp);
  }).catch(function (e) {
    return next(e);
  }); // eslint-disable-line
};

// ------------------------------------------------------------------------------------------------

// is authenticated
var isAuth = exports.isAuth = function isAuth(req) {
  return typeof req[requestProperty] !== 'undefined' && _Utils2.default.isNotEmptyObject(req[requestProperty]);
};

var isAdmin = exports.isAdmin = function isAdmin(req) {
  return isAuth(req) && req[requestProperty].role.toLowerCase() === 'admin';
};

var isEditor = exports.isEditor = function isEditor(req) {
  return isAuth(req) && (req[requestProperty].role.toLowerCase() === 'admin' || req[requestProperty].role.toLowerCase() === 'editor');
};

var isUser = exports.isUser = function isUser(req) {
  return isAuth(req) && req[requestProperty].role.toLowerCase() === 'user';
};

var adminAuth = exports.adminAuth = function adminAuth(req, res, next) {
  if (!isAdmin(req)) {
    return next(new _APIError2.default('Forbidden (1).', _httpStatus2.default.FORBIDDEN, true));
  }
  return next();
};

var editorAuth = exports.editorAuth = function editorAuth(req, res, next) {
  if (!isEditor(req)) {
    return next(new _APIError2.default('Forbidden (2).', _httpStatus2.default.FORBIDDEN, true));
  }
  return next();
};

var adminOrEditorAuth = exports.adminOrEditorAuth = function adminOrEditorAuth(req, res, next) {
  if (isAdmin(req) || isEditor(req)) return next();
  return next(new _APIError2.default('Forbidden (3).', _httpStatus2.default.FORBIDDEN, true));
};

var userAuth = exports.userAuth = function userAuth(req, res, next) {
  if (!isUser(req)) {
    return next(new _APIError2.default('Forbidden (4).', _httpStatus2.default.FORBIDDEN, true));
  }
  return next();
};

var getJwtInfo = exports.getJwtInfo = function getJwtInfo(req) {
  return isAuth(req) ? req[requestProperty] : null;
};

// ------------------------------------------------------------------------------------------------

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
// req[requestProperty] is assigned by jwt middleware if valid token is provided
var getRandomNumber = exports.getRandomNumber = function getRandomNumber(req, res) {
  return res.json(new _APIResponse2.default({
    auth: req[requestProperty],
    num: Math.random() * 100
  }));
};
//# sourceMappingURL=auth.controller.js.map
